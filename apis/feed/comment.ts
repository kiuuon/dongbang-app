import { supabase } from '../supabaseClient';

export async function fetchRootComment(feedId: string, page: number) {
  const PAGE_SIZE = 20;
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;

  const { data, error } = await supabase
    .from('Comment')
    .select(
      `
    id, feed_id, parent_id, author_id, content, like_count, reply_count, created_at,
    author:User!Comment_author_id_fkey(id, name, nickname, avatar, deleted_at)
  `,
    )
    .eq('feed_id', feedId)
    .is('parent_id', null)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .range(start, end);

  if (error) throw error;

  return data.map((comment) => ({
    ...comment,
    author: comment.author?.[0] || comment.author,
  }));
}

export async function fetchCommentDetail(commentId: string) {
  const { data, error } = await supabase
    .from('Comment')
    .select('author:User!Comment_author_id_fkey(id, name, nickname)')
    .eq('id', commentId)
    .is('deleted_at', null)
    .single();

  if (error) throw error;

  if (!data) return null;

  return {
    ...data,
    author: Array.isArray(data.author) ? data.author[0] : data.author,
  };
}

export async function fetchReplyComment(feedId: string, parentId: string, page: number) {
  const PAGE_SIZE = 5;
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;

  const { data, error } = await supabase
    .from('Comment')
    .select(
      `
    id, feed_id, parent_id, author_id, content, like_count, reply_count, created_at,
    author:User!Comment_author_id_fkey(id, name, nickname, avatar, deleted_at)
  `,
    )
    .eq('feed_id', feedId)
    .eq('parent_id', parentId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true })
    .range(start, end);

  if (error) throw error;

  return data.map((comment) => ({
    ...comment,
    author: comment.author?.[0] || comment.author,
  }));
}

export async function addRootComment(feedId: string, content: string) {
  const { error } = await supabase.rpc('write_comment', {
    p_feed_id: feedId,
    p_parent_id: null,
    p_content: content,
  });

  if (error) throw error;
}

export async function addReplyComment(feedId: string, parentId: string, content: string) {
  const { error } = await supabase.rpc('write_comment', {
    p_feed_id: feedId,
    p_parent_id: parentId,
    p_content: content,
  });

  if (error) throw error;
}

export async function deleteComment(commentId: string) {
  const { error } = await supabase.rpc('delete_comment', {
    p_comment_id: commentId,
  });

  if (error) throw error;
}

export async function fetchMyCommentLike(commentId: string, userId: string) {
  const { data, error } = await supabase
    .from('Comment_Like')
    .select('*')
    .eq('comment_id', commentId)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) throw error;

  return !!data;
}

export async function toggleCommentLike(commentId: string) {
  const { error } = await supabase.rpc('toggle_comment_like', {
    p_comment_id: commentId,
  });

  if (error) throw error;
}
