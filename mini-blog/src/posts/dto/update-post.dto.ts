// src/posts/dto/update-post.dto.ts
// 可以从 CreatePostDto 继承，或者使用 @nestjs/mapped-types 包更方便地创建部分类型
// npm install @nestjs/mapped-types

import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

// NOTE: 自动继承 CreatePostDto 的所有属性，但都变成可选的
export class UpdatePostDto extends PartialType(CreatePostDto) {}


// 为简单起见，手动定义，所有字段可选：
// export class UpdatePostDto {
//     title?: string;
//     content?: string;
//     author?: string;
// }