import { supabase } from './supabaseClient';
import { fetchUserId } from './user';

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
