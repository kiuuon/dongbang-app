import { MessageType } from '@/types/MessageType';

export default function groupSystemMessages(messages: MessageType[]) {
  const grouped: MessageType[] = [];
  let currentGroup: MessageType[] = [];

  messages.forEach((message) => {
    if (message.message_type === 'system') {
      const messageTime = new Date(message.created_at);
      const messageMinute = `${messageTime.getFullYear()}-${String(messageTime.getMonth() + 1).padStart(2, '0')}-${String(messageTime.getDate()).padStart(2, '0')} ${String(messageTime.getHours()).padStart(2, '0')}:${String(messageTime.getMinutes()).padStart(2, '0')}`;
      const messageType = message.metadata?.type;

      // 현재 그룹이 비어있거나, 같은 시간(분) + 같은 타입이면 그룹에 추가
      if (
        currentGroup.length === 0 ||
        (currentGroup[0].group_time === messageMinute && currentGroup[0].group_type === messageType)
      ) {
        currentGroup.push({
          ...message,
          group_time: messageMinute,
          group_type: messageType,
        });
      } else {
        // 그룹이 끝났으므로 저장하고 새 그룹 시작
        if (currentGroup.length > 0) {
          grouped.push({
            id: `group-${currentGroup[0].id}`,
            message_type: 'grouped_system',
            group_messages: currentGroup,
            created_at: currentGroup[0].created_at,
            isMine: currentGroup[0].isMine,
            is_unread: currentGroup[0].is_unread,
            chat_room_id: currentGroup[0].chat_room_id,
          });
        }
        currentGroup = [
          {
            ...message,
            group_time: messageMinute,
            group_type: messageType,
          },
        ];
      }
    } else {
      // system 메시지가 아니면 현재 그룹을 저장하고 일반 메시지 추가
      if (currentGroup.length > 0) {
        grouped.push({
          id: `group-${currentGroup[0].id}`,
          message_type: 'grouped_system',
          group_messages: currentGroup,
          created_at: currentGroup[0].created_at,
          isMine: currentGroup[0].isMine,
          is_unread: currentGroup[0].is_unread,
          chat_room_id: currentGroup[0].chat_room_id,
        });
        currentGroup = [];
      }
      grouped.push(message);
    }
  });

  // 마지막 그룹 저장
  if (currentGroup.length > 0) {
    grouped.push({
      id: `group-${currentGroup[0].id}`,
      message_type: 'grouped_system',
      group_messages: currentGroup,
      created_at: currentGroup[0].created_at,
      isMine: currentGroup[0].isMine,
      is_unread: currentGroup[0].is_unread,
      chat_room_id: currentGroup[0].chat_room_id,
    });
  }

  return grouped;
}
