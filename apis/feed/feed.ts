import { supabase } from '../supabaseClient';
import { fetchUserId } from '../user';

export async function writeFeed(
  photos: string[],
  title: string,
  content: string,
  isNicknameVisible: boolean,
  isPrivate: boolean,
  clubId: string,
  clubType: 'campus' | 'union',
  selectedMembers: string[],
  selectedClubs: string[],
) {
  const userId = await fetchUserId();

  const { error } = await supabase.rpc('write_feed_transaction', {
    photos,
    title,
    content,
    is_nickname_visible: isNicknameVisible,
    is_private: isPrivate,
    club_id: clubId,
    club_type: clubType,
    author_id: userId,
    selected_members: selectedMembers,
    selected_clubs: selectedClubs,
  });

  if (error) {
    throw error;
  }
}

export async function editFeed(
  feedId: string,
  photos: string[],
  title: string,
  content: string,
  isNicknameVisible: boolean,
  isPrivate: boolean,
  selectedMembers: string[],
  selectedClubs: string[],
) {
  const { error } = await supabase.rpc('edit_feed_transaction', {
    p_feed_id: feedId,
    p_photos: photos,
    p_title: title,
    p_content: content,
    p_is_nickname_visible: isNicknameVisible,
    p_is_private: isPrivate,
    p_selected_members: selectedMembers,
    p_selected_clubs: selectedClubs,
  });

  if (error) throw error;
}

export async function deleteFeed(feedId: string) {
  const { error } = await supabase.from('Feed').delete().eq('id', feedId);

  if (error) throw error;
}

export async function fetchFeedDetail(feedId: string) {
  const { data: feed, error } = await supabase
    .from('Feed')
    .select(
      `
      *,
      author:User(name, avatar),
      club:Club(name, logo),
      taggedUsers:Feed_User(user:User(id, name, avatar)),
      taggedClubs:Feed_Club(club:Club(id, name, logo))
    `,
    )
    .eq('id', feedId)
    .single();

  if (error) {
    throw error;
  }

  const { data: clubUser, error: fetchRoleError } = await supabase
    .from('Club_User')
    .select('role')
    .eq('user_id', feed.author_id)
    .eq('club_id', feed.club_id)
    .maybeSingle();

  if (fetchRoleError) {
    throw fetchRoleError;
  }

  return {
    ...feed,
    author: {
      ...feed.author,
      role: clubUser?.role ?? null,
    },
  };
}

export async function searchFeeds(keyword: string, page: number) {
  const PAGE_SIZE = 10;

  const { data, error } = await supabase.rpc('search_feeds_by_keyword', {
    keyword: keyword ?? '',
    limit_count: PAGE_SIZE,
    offset_count: page * PAGE_SIZE,
  }).select(`
      *,
      author:User(name, avatar),
      club:Club(name, logo),
      taggedUsers:Feed_User(user:User(name, avatar)),
      taggedClubs:Feed_Club(club:Club(name, logo))
    `);

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchHashtags(keyword: string, page: number) {
  if (!keyword.trim()) {
    return []; // 빈 문자열이면 바로 빈 배열 반환
  }

  const PAGE_SIZE = 20;
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;

  const { data, error } = await supabase
    .from('Hashtag')
    .select('id, name')
    .ilike('name', `%${keyword ?? ''}%`)
    .order('name', { ascending: true })
    .range(start, end);

  if (error) throw error;

  return data;
}
