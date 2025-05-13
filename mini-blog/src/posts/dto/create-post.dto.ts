/*
* DTO 的价值:
明确契约: 清晰定义了 API 期望接收的数据结构。
类型安全: 结合 TypeScript，可以在编译时和运行时获得类型检查的好处。
代码组织: 将数据结构定义与业务逻辑分离。
校验基础: 是后续使用 ValidationPipe 进行数据校验的基础 (进阶内容)
*
* */


export class CreatePostDto {
    title: string;
    content: string;
    author?: string; // 作者可选
}