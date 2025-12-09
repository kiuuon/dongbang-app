import { SafeAreaView } from 'react-native-safe-area-context';

import { router, useLocalSearchParams } from 'expo-router';

import CustomWebView from '@/components/common/CustomWebView';
import COLORS from '@/constants/colors';

function ChatRoomMenuScreen() {
  const { chatRoomId } = useLocalSearchParams();

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        key={`chat-room-menu-${chatRoomId}`}
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/chats/${chatRoomId}/menu` }}
        onMessage={(data) => {
          const { type, action, payload } = data;
          if (type === 'event') {
            if (action === 'go to club detail') {
              router.push(`/club/detail/${payload}`);
            } else if (action === 'go to profile page') {
              router.push(`/profile/${payload}`);
            }
          }
        }}
      />
    </SafeAreaView>
  );
}

export default ChatRoomMenuScreen;
