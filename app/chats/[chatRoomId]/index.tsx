/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useEffect } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  DeviceEventEmitter,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';

import { fetchUserId } from '@/apis/user';
import { fetchChatRoomInfo, sendTextMessage } from '@/apis/chats';
import COLORS from '@/constants/colors';
import { ERROR_MESSAGE } from '@/constants/error';
import { MessageType } from '@/types/MessageType';
import useFetchChatMessages from '@/hooks/chat/useFetchChatMessages';
import useSearchChatMessages from '@/hooks/chat/useSearchChatMessage';
import RightArrowIcon from '@/icons/RightArrowIcon';
import ChevronDownIcon from '@/icons/ChevronDownIcon';
import ChevronUpIcon from '@/icons/ChevronUpIcon';
import RegularText from '@/components/common/RegularText';
import ChatRoomHeader from '@/components/chat/ChatRoomHeader';
import SystemMessage from '@/components/chat/SystemMessage';
import TextMessage from '@/components/chat/TextMessage';
import BouncingMessage from '@/components/chat/BouncingMessage';

function ChatRoomScreen() {
  const queryClient = useQueryClient();
  const { chatRoomId } = useLocalSearchParams() as { chatRoomId: string };
  const [inputValue, setInputValue] = useState('');

  const flatListRef = useRef<FlatList>(null);
  const boundaryMessageRef = useRef<View>(null);
  const isAtBottomRef = useRef(true);
  const [hasPendingNewMessage, setHasPendingNewMessage] = useState(false);

  const {
    firstPageUnreadCount,
    messages,
    firstUnreadIndex,
    boundaryIndex,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    fetchPreviousPage,
    isFetchingPreviousPage,
    hasPreviousPage,
  } = useFetchChatMessages(chatRoomId as string);

  const {
    isSearchMode,
    setIsSearchMode,
    searchQuery,
    setSearchQuery,
    searchResults,
    currentSearchIndex,
    searchCount,
    isConfirm,
    setIsConfirm,
    handleSearchConfirm,
    handlePreviousSearchResult,
    handleNextSearchResult,
  } = useSearchChatMessages({ flatListRef });

  const { data: userId } = useQuery({
    queryKey: ['userId'],
    queryFn: fetchUserId,
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.USER.ID_FETCH_FAILED, error.message);
      return false;
    },
  });

  // 새 메시지 도착 시 로직
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('chat:new-message', (data) => {
      if (!isAtBottomRef.current) {
        setHasPendingNewMessage(true);

        return;
      }

      queryClient.setQueryData(['chatMessages', chatRoomId], (oldData: any) => {
        if (!oldData || !oldData.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any, index: number) => {
            if (index === 0) {
              if (oldData.pages[0].length !== 0) {
                return [data.message, ...page];
              }
            }

            if (index === 1) {
              if (oldData.pages[0].length === 0) {
                return [data.message, ...page];
              }
            }
            return page;
          }),
        };
      });

      requestAnimationFrame(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
      });
    });

    return () => subscription.remove();
  }, [chatRoomId, queryClient]);

  const { data: chatRoomInfo } = useQuery({
    queryKey: ['chatRoomInfo', chatRoomId],
    queryFn: () => fetchChatRoomInfo(chatRoomId),
    enabled: !!chatRoomId,
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.CHATS.FETCH_ROOM_INFO_FAILED, error.message);
      return false;
    },
  });

  // 텍스트 메시지 전송
  const { mutate: handleSendTextMessage } = useMutation({
    mutationFn: (content: string) => sendTextMessage(chatRoomId, content),
    // 낙관적 업데이트: 서버 응답 전에 UI에 메시지 추가
    onMutate: async (content: string) => {
      // 롤백용 스냅샷
      const previousMessages = queryClient.getQueryData(['chatMessages', chatRoomId]);

      const tempId = `temp-${Date.now()}`;
      const optimisticMessage: MessageType = {
        id: tempId,
        chat_room_id: chatRoomId,
        sender_id: userId,
        message_type: 'text',
        content,
        created_at: new Date().toISOString(),
        isMine: true,
        is_unread: false,
        unread_count: chatRoomInfo ? chatRoomInfo.members.length - 1 : 0,
      };

      // 캐시 업데이트
      queryClient.setQueryData(['chatMessages', chatRoomId], (oldData: any) => {
        if (!oldData || !oldData.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any, index: number) => {
            if (index === 0) {
              if (oldData.pages[0].length !== 0) {
                return [optimisticMessage, ...page];
              }
            }

            if (index === 1) {
              if (oldData.pages[0].length === 0) {
                return [optimisticMessage, ...page];
              }
            }
            return page;
          }),
        };
      });

      return { previousMessages, tempId };
    },
    onSuccess: (data, _, context: any) => {
      const { tempId } = context;

      if (!tempId) return;

      queryClient.setQueryData(['chatMessages', chatRoomId], (oldData: any) => {
        if (!oldData) return oldData;

        let found = false;
        const updatedPages = oldData.pages.map((page: any[]) => {
          if (page.length === 0) {
            return [];
          }
          return page.map((msg: any) => {
            if (!found && msg.id === tempId) {
              found = true;
              return data;
            }
            return msg;
          });
        });

        return found ? { ...oldData, pages: updatedPages } : oldData;
      });

      setInputValue('');

      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
      }, 100);
    },
    onError: (error, _, context: any) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(['chatMessages', chatRoomId], context.previousMessages);
      }

      Alert.alert(ERROR_MESSAGE.CHATS.SEND_FAILED, error.message);
    },
  });

  // 마지막으로 읽은 메세지로 스크롤
  useEffect(() => {
    if (firstPageUnreadCount === 11 && firstUnreadIndex >= 0) {
      // 약간의 지연을 주어 레이아웃 렌더링 후 이동하도록 합니다.
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: firstUnreadIndex,
          animated: false,
          viewPosition: 0.5, // 0이면 하단, 0.5면 중앙, 1이면 상단에 위치시킴
        });
      }, 100);
      return () => clearTimeout(timer);
    }

    return () => {};
  }, [firstPageUnreadCount, firstUnreadIndex]);

  // 채팅방 나가면 캐시 삭제
  useEffect(
    () => () => queryClient.removeQueries({ queryKey: ['chatMessages', chatRoomId] }),
    [chatRoomId, queryClient],
  );

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: COLORS.tag }}>
        <ChatRoomHeader
          isSearchMode={isSearchMode}
          setIsSearchMode={setIsSearchMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearchConfirm={handleSearchConfirm}
          setInputValue={setInputValue}
          setIsConfirm={setIsConfirm}
        />
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={{ height: '100%' }}>
          <FlatList
            inverted
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => {
              return item.id;
            }}
            renderItem={({ item, index }) => {
              const isSearchResult = searchResults[currentSearchIndex]?.id === item.id;
              return (
                <BouncingMessage isSearchResult={isSearchResult}>
                  {item.message_type === 'grouped_system' && (
                    <SystemMessage
                      message={item}
                      index={index}
                      boundaryIndex={boundaryIndex}
                      boundaryMessageRef={boundaryMessageRef}
                    />
                  )}

                  {firstPageUnreadCount === 11 && firstUnreadIndex >= 0 && index === firstUnreadIndex && (
                    <View
                      style={{
                        alignSelf: 'center',
                        marginBottom: 8,
                        maxWidth: '100%',
                        backgroundColor: COLORS.gray3,
                        borderRadius: 16,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        opacity: 0.6,
                      }}
                    >
                      <RegularText fontSize={14} style={{ color: COLORS.white }}>
                        마지막으로 읽은 위치
                      </RegularText>
                    </View>
                  )}

                  {item.message_type === 'text' && (
                    <TextMessage
                      message={item}
                      messages={messages}
                      index={index}
                      boundaryIndex={boundaryIndex}
                      boundaryMessageRef={boundaryMessageRef}
                      searchQuery={searchQuery}
                    />
                  )}
                </BouncingMessage>
              );
            }}
            style={styles.scrollView}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.5}
            onScroll={({ nativeEvent }) => {
              const { contentOffset } = nativeEvent;
              if (contentOffset.y <= 50 && hasPreviousPage && !isFetchingPreviousPage) {
                fetchPreviousPage();
              }

              if (contentOffset.y <= 50) {
                isAtBottomRef.current = true;
              } else {
                isAtBottomRef.current = false;
              }
            }}
            maintainVisibleContentPosition={{
              minIndexForVisible: 1,
              autoscrollToTopThreshold: undefined,
            }}
          />
          <SafeAreaView edges={['bottom']} style={styles.inputContainer}>
            {hasPendingNewMessage && (
              <View style={{ position: 'absolute', top: -60, width: '100%', justifyContent: 'center' }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: COLORS.primary,
                    borderRadius: 8,
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    alignSelf: 'center',
                  }}
                  onPress={async () => {
                    setHasPendingNewMessage(false);
                    await queryClient.invalidateQueries({ queryKey: ['chatMessages', chatRoomId] });
                    requestAnimationFrame(() => {
                      flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
                    });
                  }}
                >
                  <RegularText fontSize={16} style={{ color: COLORS.white }}>
                    새 메시지 보기
                  </RegularText>
                </TouchableOpacity>
              </View>
            )}
            {isSearchMode ? (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 22 }}>
                <View style={{ width: 56 }} />
                {isConfirm ? (
                  <RegularText fontSize={16}>
                    {currentSearchIndex + 1}/{searchCount}
                  </RegularText>
                ) : (
                  <View />
                )}
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity onPress={handlePreviousSearchResult}>
                    <ChevronDownIcon />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleNextSearchResult}>
                    <ChevronUpIcon />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TextInput
                multiline
                scrollEnabled={false}
                placeholder={chatRoomInfo?.is_active ? '입력' : '채팅방이 비활성화되었습니다.'}
                style={styles.textInput}
                placeholderTextColor={COLORS.gray2}
                value={inputValue}
                onChangeText={setInputValue}
                editable={chatRoomInfo?.is_active}
              />
            )}
            {inputValue.trim() !== '' && (
              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => {
                  if (inputValue.trim() === '') return;
                  handleSendTextMessage(inputValue);
                }}
              >
                <RightArrowIcon />
              </TouchableOpacity>
            )}
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.tag,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },

  inputContainer: {
    position: 'relative',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray0,
  },
  textInput: {
    backgroundColor: COLORS.gray0,
    borderRadius: 8,
    paddingLeft: 18,
    paddingRight: 40,
    paddingVertical: 8,
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    color: COLORS.black,
  },
  sendButton: {
    position: 'absolute',
    right: 26,
    bottom: 52,
  },
});

export default ChatRoomScreen;
