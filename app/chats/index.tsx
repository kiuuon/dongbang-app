import { useCallback } from 'react';
import { Alert, TouchableOpacity, View, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchMyChatRooms } from '@/apis/chats';
import formatChatTime from '@/utils/chat/formatChatTime';
import COLORS from '@/constants/colors';
import { ERROR_MESSAGE } from '@/constants/error';
import { ChatRoomType } from '@/types/ChatRoomType';
import LeftArrowIcon from '@/icons/LeftArrowIcon';
import BoldText from '@/components/common/SemiBoldText';
import RegularText from '@/components/common/RegularText';

function ChatListScreen() {
  const queryClient = useQueryClient();

  const { data: chatRooms } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: fetchMyChatRooms,
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.CHATS.FETCH_FAILED, error.message);
      return false;
    },
  });

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });

      return () => {};
    }, [queryClient]),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <LeftArrowIcon color={COLORS.black} />
        </TouchableOpacity>
        <BoldText fontSize={16}>채팅</BoldText>
      </View>
      <ScrollView style={styles.chatRoomList} contentContainerStyle={{ gap: 8 }}>
        {chatRooms?.map((chatRoom: ChatRoomType) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push(`/chats/${chatRoom.chat_room_id}`)}
            key={chatRoom.chat_room_id}
            style={styles.chatRoomCard}
          >
            <Image source={{ uri: chatRoom.club_logo }} resizeMode="cover" style={styles.clubLogo} />
            <View style={{ flex: 1, flexDirection: 'column', gap: 3 }}>
              <BoldText fontSize={14}>{chatRoom.chat_room_name}</BoldText>
              <RegularText fontSize={12} numberOfLines={1} style={{ color: COLORS.gray3 }}>
                {chatRoom.latest_message_content}
              </RegularText>
            </View>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'flex-start',
                height: '100%',
                gap: 5,
                alignItems: 'flex-end',
              }}
            >
              <RegularText fontSize={12} style={{ color: COLORS.gray1 }}>
                {formatChatTime(chatRoom.latest_message_created_at || '')}
              </RegularText>
              {chatRoom.unread_count > 0 && (
                <View
                  style={{
                    backgroundColor: COLORS.error,
                    borderRadius: 8,
                    paddingHorizontal: 5,
                    paddingVertical: 1,
                    height: 18,
                    minWidth: 18,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}
                >
                  <RegularText fontSize={12} style={{ color: COLORS.white }}>
                    {chatRoom.unread_count > 99 ? '99+' : chatRoom.unread_count}
                  </RegularText>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    position: 'sticky',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    height: 60,
    gap: 10,
  },
  chatRoomList: {
    flex: 1,
    paddingVertical: 23,
    paddingHorizontal: 20,
  },
  chatRoomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 20,
    paddingRight: 13,
    paddingVertical: 16,
    borderRadius: 16,
    boxShadow: '0px 1px 24px rgba(0, 0, 0, 0.08)',
  },
  clubLogo: {
    width: 40,
    height: 40,
    borderRadius: 16,
  },
});

export default ChatListScreen;
