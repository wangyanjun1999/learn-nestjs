"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsController = void 0;
const common_1 = require("@nestjs/common");
const posts_service_1 = require("./posts.service");
const create_post_dto_1 = require("./dto/create-post.dto");
let PostsController = class PostsController {
    findAllPosts(authorParam, limitParam) {
        console.log(`Fetching posts. Author filter: ${authorParam}, Limit: ${limitParam}`);
        let filteredPosts = [...posts_service_1.postsDb];
        if (authorParam) {
            filteredPosts = posts_service_1.postsDb.filter(post => post.author?.toLowerCase() === authorParam.toLowerCase());
        }
        if (limitParam) {
            const limit = parseInt(limitParam, 10);
            if (!isNaN(limit) && limit > 0) {
                filteredPosts = filteredPosts.slice(0, limit);
            }
        }
        return filteredPosts;
    }
    findLatestPost() {
        console.log('Fetching the latest post');
        return posts_service_1.postsDb.length > 0 ? posts_service_1.postsDb[0] : undefined;
    }
    findPostsCount() {
        console.log('Fetching posts count');
        return posts_service_1.postsDb.length;
    }
    findPostById(id) {
        console.log(`Workspaceing post with id: ${id}`);
        const postId = parseInt(id, 10);
        const post = posts_service_1.postsDb.find(p => p.id === postId);
        if (!post) {
            throw new common_1.NotFoundException(`Post with ID ${id} not found`);
        }
        return post;
    }
    findPostBySlug(slug) {
        console.log(`Fetching post with slug: ${slug}`);
        const post = posts_service_1.postsDb.find(p => p.slug === slug);
        if (!post) {
            throw new common_1.NotFoundException(`Post with slug ${slug} not found`);
        }
        return post;
    }
    createPost(createPostDto) {
        console.log('Received data to create post:', createPostDto);
        const nextId = posts_service_1.postsDb.length > 0 ? Math.max(...posts_service_1.postsDb.map(p => p.id)) + 1 : 1;
        const newPost = {
            id: nextId,
            title: createPostDto.title,
            content: createPostDto.content,
            author: createPostDto.author,
        };
        posts_service_1.postsDb.push(newPost);
        console.log('New post created:', newPost);
        return newPost;
    }
};
exports.PostsController = PostsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('author')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Array)
], PostsController.prototype, "findAllPosts", null);
__decorate([
    (0, common_1.Get)('latest'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], PostsController.prototype, "findLatestPost", null);
__decorate([
    (0, common_1.Get)('count'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Number)
], PostsController.prototype, "findPostsCount", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], PostsController.prototype, "findPostById", null);
__decorate([
    (0, common_1.Get)('slug/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], PostsController.prototype, "findPostBySlug", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_post_dto_1.CreatePostDto]),
    __metadata("design:returntype", Object)
], PostsController.prototype, "createPost", null);
exports.PostsController = PostsController = __decorate([
    (0, common_1.Controller)('posts')
], PostsController);
//# sourceMappingURL=posts.controller.js.map