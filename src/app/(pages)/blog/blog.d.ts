export interface IPost {
    title: string;
    body: string;
    thumbnail?: File;
}

export interface PostResponse {
    title: string;
    body: string;
    thumbnail?: string;
    created: Date;
}