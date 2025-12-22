export interface ChatRoomType {
  chat_room_id: string;
  chat_room_name: string;
  club_logo: string;
  latest_message_content?: string;
  latest_message_type?: string;
  latest_message_created_at?: string;
  unread_count: number;
}
