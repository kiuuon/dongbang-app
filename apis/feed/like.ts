import { supabase } from '../supabaseClient';

export async function fetchFeedLikeCount(feedId: string) {
  const { data, error } = await supabase.from('Feed').select('like_count').eq('id', feedId).single();

  if (error) throw error;

  if (!data) return 0;

  return data.like_count as number;
}

type LikedUser = {
  id: string;
  name: string;
  avatar: string | null;
};

export async function fetchFeedLikedUsers(feedId: string): Promise<LikedUser[] | null> {
  const { data, error } = await supabase
    .from('Feed_Like')
    .select(
      `
      User!inner (
        id,
        name,
        avatar
      )
    `,
    )
    .eq('feed_id', feedId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!data) return [];

  return data.flatMap((like) =>
    (Array.isArray(like.User) ? like.User : [like.User]).map((user) => ({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
    })),
  );
}
