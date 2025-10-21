import { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import CustomWebView from '@/components/common/CustomWebView';
import COLORS from '@/constants/colors';
import LoginModal from '@/components/common/LoginModal';

function ComingSoonScreen() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const webViewRef = useRef(null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        ref={webViewRef}
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/coming-soon` }}
        onMessage={(data) => {
          const { type, action } = data;
          if (type === 'event') {
            if (action === 'complete send feedback') {
              router.back();
            } else if (action === 'open login modal') {
              setIsLoginModalOpen(true);
            }
          }
        }}
      />

      <LoginModal visible={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} webViewRef={webViewRef} />
    </SafeAreaView>
  );
}

export default ComingSoonScreen;
