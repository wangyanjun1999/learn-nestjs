// 模拟数据库或服务层
export interface PostSchma {
    id: number;
    title: string;
    content: string;
    author?: string; // 新增作者字段
    slug?: string; // 新增 slug 字段
}

export const postsDb: PostSchma[] = [
    { id: 1, title: 'NestJS 学习笔记', content: '控制器是核心...', author: 'Alice', slug: 'nestjs' },
    { id: 2, title: 'TypeScript 技巧', content: '类型系统真强大...', author: 'Bob', slug: 'type' },
];
let nextId = 3;