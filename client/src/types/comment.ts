import type { User } from './auth';

export type CommentType = 'TEXT' | 'MEDIA' | 'VOICE';

export type Reaction = {
  id: string;
  emoji: string;
  userId: string;
  commentId: string;
  createdAt: string;
};

export type Comment = {
  id: string;
  content: string | null;
  type: CommentType;
  fileUrl: string | null;
  fileName: string | null;
  fileType: string | null;
  createdAt: string;
  updatedAt: string;
  taskId: string;
  userId: string;
  user: Pick<User, 'id' | 'name' | 'avatar'>;
  reactions: Reaction[];
};

export type CreateCommentPayload = {
  content: string;
};

export type UpdateCommentPayload = {
  content: string;
};
