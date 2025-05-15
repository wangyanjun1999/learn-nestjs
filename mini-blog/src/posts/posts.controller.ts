import {
    Controller,
    Get,
    Param,
    NotFoundException,
    Post,
    Body,
    Query,
    Patch,
    Put,
    Delete, HttpCode, HttpStatus
} from '@nestjs/common';
// import { PostsService } from './posts.service'; // 引入模拟数据库
import { postsDb } from './posts.service'; // 引入模拟数据库
import { PostSchma } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import {UpdatePostDto} from "./dto/update-post.dto";
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
    // constructor(private readonly postsService: PostsService) {}

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


    /*
    * 把 @Query() 用在需要从路径中提取参数的地方。
    * 例如，想处理 /posts/Alice 却用了 @Query('author')。
    * 原因: @Query() 只处理 ? 后面的参数。
    * 正确: 对于 /posts/Alice 应该用 @Get(':author') 和 @Param('author')。
    * */

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




    @Patch(':id') // 映射到 PATCH /posts/:id
    updatePostPartial(
        @Param('id') id: string,
        // 设置默认值为 {}，以便在没有请求体时仍然能正常工作
        @Body() updatePostDto : UpdatePostDto = {} // 使用 UpdatePostDto 来表示部分更新,
    ): PostSchma {
        /*
        *  // ⚡ 挑战:
  // 在 PATCH 方法中，如果 updatePostDto 是一个空对象 {} (客户端发送了一个空的 JSON body)，
  // 现在的实现会如何表现？这是否是期望的行为？如果不期望，如何修改以至少返回原始文章或提示无需更新？
}*/
        if (Object.keys(updatePostDto).length === 0) {
            // 如果 updatePostDto 是一个空对象，返回原始文章或提示无需更新
            const postId = parseInt(id, 10);
            const post = postsDb.find(p => p.id === postId);
            if (!post) {
                throw new NotFoundException(`Post with ID ${id} not found for update.`);
            }
            console.log('No updates provided, returning original post:', post);
            return post;
        }



        console.log(`Partially updating post with id: ${id} with data:`, updatePostDto);
        const postId = parseInt(id, 10);
        const postIndex = postsDb.findIndex(p => p.id === postId);

        if (postIndex === -1) {
            throw new NotFoundException(`Post with ID ${id} not found for update.`);
        }




    // 在 PATCH 方法中，如果 updatePostDto 是一个空对象 {} (客户端发送了一个空的 JSON body)，
    // 现在的实现会如何表现？这是否是期望的行为？如果不期望，如何修改以至少返回原始文章或提示无需更新？
        // 将传入的 DTO 中的字段合并到现有文章对象上
        // 只有 DTO 中存在的字段才会被更新
        const updatedPost = { ...postsDb[postIndex], ...updatePostDto };
        postsDb[postIndex] = updatedPost;

        console.log('Post updated:', updatedPost);
        return updatedPost;
}



    // ⚠️ 概念性 PUT 实现 (用于对比)
    // 在实际项目中，PUT 的行为 (是否允许部分字段缺失以及如何处理) 需要仔细定义
    @Put(':id') // 映射到 PUT /posts/:id
    updatePostFull(
        @Param('id') id: string,
        @Body() updatePostDto: CreatePostDto, // 注意：这里使用 CreatePostDto 强调所有字段应提供
        // 或者一个 UpdatePostDto，但逻辑需处理字段缺失的情况
    ): PostSchma {
        console.log(`Fully updating post with id: ${id} with data:`, updatePostDto);
        const postId = parseInt(id, 10);
        const postIndex = postsDb.findIndex(p => p.id === postId);

        if (postIndex === -1) {
            throw new NotFoundException(`Post with ID ${id} not found for full update.`);
        }

        // 对于 PUT，通常期望提供完整的资源表示
        // 如果 updatePostDto 的某些字段是 undefined，它们也会覆盖掉原有值
        const updatedPost: PostSchma = {
            id: postId, // id 保持不变
            title: updatePostDto.title,
            content: updatePostDto.content,
            author: updatePostDto.author,
        };
        postsDb[postIndex] = updatedPost;

        console.log('Post fully updated/replaced:', updatedPost);
        return updatedPost;
    }



    @Delete(':id') // 映射到 DELETE /posts/:id
    @HttpCode(HttpStatus.NO_CONTENT) // ⚡ 推荐：成功删除后返回 204 No Content
    removePost(@Param('id') id: string): void { // 返回 void 结合 @HttpCode(204) 是常见做法
        console.log(`Attempting to delete post with id: ${id}`);
        const postId = parseInt(id, 10);
        const postIndex = postsDb.findIndex(p => p.id === postId);

        if (postIndex === -1) {
            throw  new NotFoundException(`Post with ID ${id} not found for deletion.`);
            }

            postsDb.splice(postIndex, 1); // 从数组中移除文章
            console.log(`Post with id: ${id} deleted successfully.`);
            // 当使用 @HttpCode(204) 时，此方法不需要显式 return
            // 如果不设置 @HttpCode(204) 并返回 void，NestJS 默认也可能发 204 或 200 空响应
            // 若想返回被删除的对象（不常见但可以）： return deletedPost; 并移除 @HttpCode(204)
        }

        // ⚡ 挑战:
        // 如果一个作者有多篇文章，实现一个 `DELETE /posts/by-author/:authorName` 端点，
        // 删除该作者的所有文章。你需要如何修改 `postsDb`？此操作应返回什么？
        // (提示: 可能需要循环或 filter 创建新数组，并考虑返回被删除文章的数量或 ID 列表)
        // @Delete('by-author/:authorName') // 映射到 DELETE /posts/by-author/:authorName
        // @HttpCode(HttpStatus.NO_CONTENT) // 推荐：成功删除后返回 204 No Content
        // removePostsByAuthor(@Param('authorName') authorName: string): void {
        //     console.log(`Attempting to delete posts by author: ${authorName}`);
        //     const initialLength = postsDb.length;
        //     postsDb = postsDb.filter(post => post.author !== authorName); // 创建新数组，排除指定作者的文章
        //     const deletedCount = initialLength - postsDb.length;
        //
        //     if (deletedCount === 0) {
        //         throw new NotFoundException(`No posts found for author ${authorName} to delete.`);
        //     }
        //
        //     console.log(`${deletedCount} posts by author ${authorName} deleted successfully.`);
        // } 

}



