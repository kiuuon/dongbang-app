import { supabase } from './supabaseClient';

export async function getChatRoomIdByClubId(clubId: string) {
  const { data, error } = await supabase.rpc('get_chat_room_id_by_club_id', {
    p_club_id: clubId,
  });

  if (error) throw error;

  return data;
}

export async function fetchMyChatRooms() {
  const { data, error } = await supabase.rpc('get_my_chat_rooms');

  if (error) throw error;

  return data;
}

export async function updateLastReadAt(chatRoomId: string) {
  const { error } = await supabase.rpc('update_last_read_at', {
    p_chat_room_id: chatRoomId,
  });

  if (error) throw error;
}
