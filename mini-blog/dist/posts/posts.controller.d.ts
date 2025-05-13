import { PostSchma } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
export declare class PostsController {
    findAllPosts(authorParam?: string, limitParam?: string): PostSchma[];
    findLatestPost(): PostSchma | undefined;
    findPostsCount(): number;
    findPostById(id: string): PostSchma;
    findPostBySlug(slug: string): PostSchma | undefined;
    createPost(createPostDto: CreatePostDto): PostSchma;
}
