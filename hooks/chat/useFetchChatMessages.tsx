import { useMemo } from 'react';
import { Alert } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchChatMessages } from '@/apis/chats';
import { MessageType } from '@/types/MessageType';
import { ERROR_MESSAGE } from '@/constants/error';

function groupSystemMessages(messages: MessageType[]) {
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

function useFetchChatMessages(chatRoomId: string) {
  const {
    data: chatMessages,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    fetchPreviousPage,
    isFetchingPreviousPage,
    hasPreviousPage,
  } = useInfiniteQuery({
    queryKey: ['chatMessages', chatRoomId],
    queryFn: async ({ pageParam }) =>
      fetchChatMessages(
        chatRoomId,
        pageParam as { cursor: string | null; cursorId: string | null; direction: 'initial' | 'past' | 'future' },
      ),
    initialPageParam: { cursor: null, cursorId: null, direction: 'initial' },
    // 아래로 스크롤 (최신 메시지 로드) -> PREVIOUS Page
    getPreviousPageParam: (firstPage) => {
      if (!firstPage || firstPage.length === 0) return undefined;

      const realMessage = firstPage.find((msg: MessageType) => !msg.id.toString().startsWith('temp-'));

      if (!realMessage) return undefined;

      const newestMsg = firstPage[0];
      return { cursor: newestMsg.created_at, cursorId: newestMsg.id, direction: 'future' };
    },
    // 위로 스크롤 (과거 메시지 로드) -> NEXT Page
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      const oldestMsg = lastPage[lastPage.length - 1];
      return { cursor: oldestMsg.created_at, cursorId: oldestMsg.id, direction: 'past' };
    },
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.CHATS.FETCH_FAILED, error.message);
      return false;
    },
    refetchOnWindowFocus: false,
  });

  const firstPageUnreadCount = useMemo(
    () => chatMessages?.pages[0]?.filter((message: MessageType) => message.is_unread === true).length ?? 0,
    [chatMessages?.pages],
  );

  const flatMessages = useMemo(() => (chatMessages?.pages ?? []).flat(), [chatMessages?.pages]);

  const groupedMessages = useMemo(() => groupSystemMessages(flatMessages), [flatMessages]);

  // 시스템 메시지 제외하고 첫 안 읽은 text 메시지 찾기
  const firstUnreadIndex = useMemo(
    () => groupedMessages.findLastIndex((message: MessageType) => message.message_type === 'text' && message.is_unread),
    [groupedMessages],
  );

  // 첫 안 읽은 메시지가 없으면 마지막 메시지를 경계로 사용
  const boundaryIndex = useMemo(
    () => (firstUnreadIndex >= 0 ? firstUnreadIndex : groupedMessages.length - 1),
    [firstUnreadIndex, groupedMessages.length],
  );

  return {
    firstPageUnreadCount,
    messages: groupedMessages,
    firstUnreadIndex,
    boundaryIndex,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    fetchPreviousPage,
    isFetchingPreviousPage,
    hasPreviousPage,
    chatMessages,
  };
}

export default useFetchChatMessages;
