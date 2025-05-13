import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsController } from './posts/posts.controller';

@Module({
  imports: [],

  // 如果控制器没有在模块中声明，那么它的路由将不会被注册。
  // 查看注册: [Nest] 45211  - 05/12/2025, 2:19:40 PM     LOG [RoutesResolver] PostsController {/posts}: +0ms
  controllers: [AppController, PostsController],
  providers: [AppService],
})
export class AppModule {}
