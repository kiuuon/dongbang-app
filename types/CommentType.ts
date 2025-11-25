export interface CommentType {
  id: string;
  parent_id: string;
  author_id: string;
  author: {
    id: string;
    avatar: string;
    name: string;
    nickname: string;
  };
  content: string;
  feed_id: string;
  like_count: number;
  reply_count: number;
  created_at: string;
}
