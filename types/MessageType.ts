export interface MessageType {
  unread_count?: number;
  id: string;
  chat_room_id: string;
  sender_id?: string;
  sender?: {
    id: string;
    name: string;
    nickname: string;
    avatar: string;
    club_nickname: string;
  };
  metadata?: {
    type: string;
    user_id: string;
    user_name: string;
  };
  message_type: string;
  content?: string;
  isMine: boolean;
  is_unread: boolean;
  created_at: string;
  group_time?: string;
  group_type?: string;
  group_messages?: MessageType[];
}
