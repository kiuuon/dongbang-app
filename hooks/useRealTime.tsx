/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import { Alert, DeviceEventEmitter } from 'react-native';
import { usePathname } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchSession } from '@/apis/auth';
import { supabase } from '@/apis/supabaseClient';
import { fetchMyChatRooms, updateLastReadAt } from '@/apis/chats';
import { ERROR_MESSAGE } from '@/constants/error';
import { MessageType } from '@/types/MessageType';

export function useRealtime() {
  const queryClient = useQueryClient();
  const chatRoomChannelsRef = useRef<Map<string, any>>(new Map());

  const pathname = usePathname();

  // 경로에서 chatRoomId 추출: /chats/[chatRoomId] 형태
  const chatRoomIdMatch = pathname?.match(/^\/chats\/([^/]+)/);
  const currentChatRoomId = chatRoomIdMatch ? chatRoomIdMatch[1] : undefined;
  const currentChatRoomIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    currentChatRoomIdRef.current = currentChatRoomId;
  }, [currentChatRoomId]);

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.SESSION.FETCH_FAILED, error.message);
      return false;
    },
  });

  // 내가 속한 채팅방 목록 가져오기
  const { data: chatRooms } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: fetchMyChatRooms,
    enabled: !!session?.user,
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.CHATS.FETCH_FAILED, error.message);
      return false;
    },
  });

  useEffect(() => {
    if (!chatRooms || chatRooms.length === 0) return;

    // 각 채팅방에 대해 구독
    chatRooms.forEach((chatRoom: { chat_room_id: string }) => {
      const chatRoomId = chatRoom.chat_room_id;

      // 이미 구독 중이면 스킵
      if (chatRoomChannelsRef.current.has(chatRoomId)) return;

      const channel = supabase
        .channel(`chat_room_${chatRoomId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_message',
            filter: `chat_room_id=eq.${chatRoomId}`,
          },
          async (payload) => {
            const newMessage = payload.new as any;

            // 현재 사용자 ID 가져오기
            const {
              data: { user },
            } = await supabase.auth.getUser();
            const currentUserId = user?.id;

            if (newMessage.sender_id === currentUserId && newMessage.message_type === 'text') {
              return;
            }

            // sender 정보 가져오기
            const { data: senderData } = await supabase
              .from('User')
              .select('id, name, nickname, avatar, deleted_at')
              .eq('id', newMessage.sender_id)
              .single();

            // club_nickname 가져오기
            const { data: chatRoomData } = await supabase
              .from('chat_room')
              .select('club_id, name')
              .eq('id', chatRoomId)
              .single();

            let clubNickname = '';
            if (chatRoomData) {
              const { data: clubUserData } = await supabase
                .from('Club_User')
                .select('club_nickname')
                .eq('club_id', chatRoomData.club_id)
                .eq('user_id', newMessage.sender_id)
                .is('deleted_at', null)
                .maybeSingle();

              clubNickname = clubUserData?.club_nickname || '';
            }

            // 메시지 객체 생성
            const message: MessageType = {
              ...newMessage,
              sender: senderData
                ? {
                    id: senderData.id,
                    name: senderData.name,
                    nickname: senderData.nickname,
                    avatar: senderData.avatar,
                    deleted_at: senderData.deleted_at,
                    club_nickname: clubNickname,
                  }
                : undefined,
              isMine: newMessage.sender_id === currentUserId,
              is_unread: currentChatRoomIdRef.current !== chatRoomId, // 현재 채팅방이면 false
            };

            // 현재 채팅방이 아니면 알림 표시
            if (currentChatRoomIdRef.current !== chatRoomId) {
              queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
              queryClient.invalidateQueries({ queryKey: ['chatRoomInfo', chatRoomId] });
            } else {
              // 채팅 페이지가 처리할 수 있도록 전역 이벤트 발행
              DeviceEventEmitter.emit('chat:new-message', { message });

              updateLastReadAt(chatRoomId);
            }
          },
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'chat_message',
            filter: `chat_room_id=eq.${chatRoomId}`,
          },
          async (payload) => {
            const updatedMessage = payload.new as any;
            const oldMessage = payload.old as any;

            // unread_count가 업데이트된 경우
            if (updatedMessage.unread_count !== oldMessage.unread_count) {
              // 현재 채팅방이면 React Query 캐시에서 해당 메시지의 unread_count 업데이트
              if (currentChatRoomIdRef.current === chatRoomId) {
                queryClient.setQueryData(['chatMessages', chatRoomId], (oldData: any) => {
                  if (!oldData) return oldData;

                  // 모든 페이지에서 해당 메시지의 unread_count 업데이트
                  const updatedPages = oldData.pages.map((page: any[]) =>
                    page.map((msg: any) => {
                      if (msg.id === updatedMessage.id) {
                        return {
                          ...msg,
                          unread_count: updatedMessage.unread_count,
                        };
                      }
                      return msg;
                    }),
                  );

                  return {
                    ...oldData,
                    pages: updatedPages,
                  };
                });
              }
            }
          },
        )
        .subscribe();

      chatRoomChannelsRef.current.set(chatRoomId, channel);
    });

    // cleanup: 구독 해제
    // eslint-disable-next-line consistent-return
    return () => {
      chatRoomChannelsRef.current.forEach((channel) => {
        channel.unsubscribe();
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
      chatRoomChannelsRef.current.clear();
    };
  }, [chatRooms, queryClient, session?.user?.id]);
}
