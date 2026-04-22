import { Comment } from '@/types/comment';

export interface BlogImage {
  id: number;
  url: string;
  sortOrder: number;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  isPublished: boolean;
  viewCount: number;
  publishedAt: string;
  createdAt: string;
  images: BlogImage[];
}

export interface BlogDetail extends Blog {
  comments: Comment[];
}

export interface BlogListResponse {
  data: Blog[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}