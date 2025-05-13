import {Controller, Get, Param, NotFoundException, Post,Body,Query} from '@nestjs/common';
import { postsDb } from './posts.service';
import { PostSchma } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
/*
* 控制器是 NestJS 中用 @Controller() 装饰器标记的类，负责接收特定路径的 HTTP 请求并返回响应。
*
* */

/*
* 控制器类没有在任何模块中声明。
* 原因: NestJS 不会加载未在模块中注册的控制器。
* 正确: 确保 PostsController 在 AppModule 或某个特性模块的 controllers 数组中
* */
@Controller('posts')
export class PostsController {

    // 1. 获取所有文章
    // @Get() // 映射到 GET /posts
    // findAllPosts() {
    //     console.log('Fetching all posts');
    //     return postsDb; // NestJS 会自动序列化为 JSON
    // }


/*
* // ⚡ 挑战:
  // 1. 让作者过滤不区分大小写 (e.g., ?author=alice 也能匹配到 'Alice')。
  // 2. 添加另一个查询参数 `limit` (数字类型)，限制返回的文章数量。
  //    (提示: 需要用 parseInt 转换 limit 参数，并处理无效输入)
  * */
@Get()
findAllPosts(
    @Query('author') authorParam?: string,
    @Query('limit') limitParam?: string
): PostSchma[] {
    console.log(`Fetching posts. Author filter: ${authorParam}, Limit: ${limitParam}`);

    let filteredPosts = [...postsDb];

    // 按作者过滤（不区分大小写）
    if (authorParam) {
        filteredPosts = postsDb.filter(post =>
            post.author?.toLowerCase() === authorParam.toLowerCase()
        );
    }

    // 应用数量限制
    if (limitParam) {
        const limit = parseInt(limitParam, 10);
        if (!isNaN(limit) && limit > 0) {
            // shawdow copy filteredPosts to avoid modifying the original array
            filteredPosts = filteredPosts.slice(0, limit);
        }
    }

    return filteredPosts;
}


    // 2.1 ⚡ 挑战: 添加一个路由 GET /posts/latest 返回第一篇文章
    @Get('latest') // 映射到 GET /posts/latest
    findLatestPost(): PostSchma | undefined {
        console.log('Fetching the latest post');
        return postsDb.length > 0 ? postsDb[0] : undefined;
    }

    // 2.2添加一个 GET /posts/count 的路由，返回当前文章的总数。
    @Get('count') // 映射到 GET /posts/count
    findPostsCount(): number {
        console.log('Fetching posts count');
        return postsDb.length;
    }

    /* 静态路径应定义在动态路径之前 latest与id */


    // 3. 动态路由参数
    @Get(':id') // 定义路由参数 :id
    findPostById(@Param('id') id: string): PostSchma { // 使用 @Param('id') 提取参数
        console.log(`Workspaceing post with id: ${id}`);
        // ! 注意: 路由参数默认是字符串，需要转换为数字进行比较
        const postId = parseInt(id, 10);
        const post = postsDb.find(p => p.id === postId);

        if (!post) {
            // 抛出 NestJS 内置的异常，会自动转换为合适的 HTTP 错误响应
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
        return post;
    }

    // 4. slug
    // ⚡ 挑战: 假设每篇文章还可以有 slug (如 'my-first-post')
    // 添加一个路由 GET /posts/slug/:slug 来通过 slug 查找文章
    // (提示: 你可能需要在 Post 接口和模拟数据中添加 slug 字段)
    @Get('slug/:slug') // 映射到 GET /posts/slug/:slug
    findPostBySlug(@Param('slug') slug: string): PostSchma | undefined {
        console.log(`Fetching post with slug: ${slug}`);
        const post = postsDb.find(p => p.slug === slug);
        if (!post) {
            throw new NotFoundException(`Post with slug ${slug} not found`);
        }
        return post;
    }



    // ============================
    // post
    // =============================




    @Post() // 映射到 POST /posts
    // 使用 @Body() 装饰器，并指定其类型为我们创建的 DTO
    /*
    * 错误: 没有使用 DTO，直接用 @Body() body: any。 原因: 失去了类型安全和结构化的优势，容易出错。 正确: 推荐为每个需要接收的 Body 定义 DTO。
    * 如果我只想获取请求体中的某个特定字段，比如 title，应该怎么做？(提示: @Body('title') title: string)
    * 如果客户端发送了一个 CreatePostDto 中没有定义的额外字段（比如 "tags": ["nestjs", "learning"]），默认情况下 @Body() 会怎么处理？(提示: 默认会接收，但 DTO 对象上不会有这个属性。可以通过 ValidationPipe 配置来剥离或报错)
    * */
    createPost(@Body() createPostDto: CreatePostDto): PostSchma {
        console.log('Received data to create post:', createPostDto);

        // 获取下一个 ID
        // 这里我们假设 postsDb 是一个数组，nextId 是下一个可用的 ID
        const nextId = postsDb.length > 0 ? Math.max(...postsDb.map(p => p.id))  + 1: 1;


        // ⚡ 挑战: 如果 DTO 里传入了 id 字段，应该忽略它，强制使用我们生成的 nextId，
        // ?   思考如何在 createPost 方法中确保这一点？
        // (提示: 直接在构造 newPost 时不使用 dto 中的 id 即可)
        const newPost: PostSchma = {
            id: nextId, // 分配新 ID 并递增
            title: createPostDto.title,
            content: createPostDto.content,
            author: createPostDto.author, // 添加作者
        };

        postsDb.push(newPost); // 将新文章添加到 "数据库"
        console.log('New post created:', newPost);
        return newPost; // 通常会返回创建成功后的资源
    }




}



