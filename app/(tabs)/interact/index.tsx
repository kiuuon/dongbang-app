import { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import COLORS from '@/constants/colors';
import CustomWebView from '@/components/common/CustomWebView';
import LoginModal from '@/components/common/LoginModal';

function InteractScreen() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [key, setKey] = useState(0);

  const webViewRef = useRef(null);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        key={key}
        setKey={setKey}
        ref={webViewRef}
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/interact` }}
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

export default InteractScreen;
