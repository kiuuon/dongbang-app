import { supabase } from './supabaseClient';

export async function getChatRoomIdByClubId(clubId: string) {
  const { data, error } = await supabase.rpc('get_chat_room_id_by_club_id', {
    p_club_id: clubId,
  });

  if (error) throw error;

  return data;
}
