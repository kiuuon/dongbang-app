import { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { router, useLocalSearchParams } from 'expo-router';

import CustomWebView from '@/components/common/CustomWebView';
import COLORS from '@/constants/colors';
import { KeyboardAvoidingView, Platform } from 'react-native';

function ChatRoomScreen() {
  const { chatRoomId } = useLocalSearchParams();
  const [shouldAvoidKeyboard, setShouldAvoidKeyboard] = useState(false);

  const handleMessage = useCallback(
    (data: { type: string; action: string; payload?: string }) => {
      const { type, action, payload } = data;
      if (type === 'event') {
        if (action === 'go to chat room menu') {
          router.push(`/chats/${chatRoomId}/menu`);
        } else if (action === 'go to profile page') {
          router.push(`/profile/${payload}`);
        } else if (action === 'top input focus') {
          setShouldAvoidKeyboard(true);
        } else if (action === 'top input blur') {
          setShouldAvoidKeyboard(false);
        }
      }
    },
    [chatRoomId],
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.tag }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        enabled={shouldAvoidKeyboard}
      >
        <CustomWebView
          source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/chats/${chatRoomId}` }}
          onMessage={handleMessage}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default ChatRoomScreen;
