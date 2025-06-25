import { supabase } from './supabaseClient';
import { fetchUserId } from './auth';

export async function writeFeed(
  photos: string[],
  title: string,
  content: string,
  isNicknameVisible: boolean,
  isPrivate: boolean,
  clubId: string,
  selectedMembers: string[],
  selectedClubs: string[],
) {
  const userId = await fetchUserId();

  const { data: feedData } = await supabase
    .from('Feed')
    .insert({
      photos,
      title,
      content,
      is_nickname_visible: isNicknameVisible,
      is_private: isPrivate,
      club_id: clubId,
      author_id: userId,
    })
    .select('id')
    .single();

  if (!feedData) {
    throw new Error('Failed to create feed');
  }

  await supabase.from('Feed_User').insert(
    selectedMembers.map((memberId) => ({
      feed_id: feedData.id,
      user_id: memberId,
    })),
  );

  await supabase.from('Feed_Club').insert(
    selectedClubs.map((selectedClubId) => ({
      feed_id: feedData.id,
      club_id: selectedClubId,
    })),
  );
}
