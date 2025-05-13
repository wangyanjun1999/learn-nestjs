export interface PostSchma {
    id: number;
    title: string;
    content: string;
    author?: string;
    slug?: string;
}
export declare const postsDb: PostSchma[];
