import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import CustomWebView from '@/components/common/CustomWebView';
import COLORS from '@/constants/colors';
import { useState } from 'react';

function MyScreen() {
  const [key, setKey] = useState(0);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        key={key}
        setKey={setKey}
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/mypage` }}
        onMessage={(data) => {
          const { type, action } = data;

          if (type === 'event') {
            if (action === 'go to login page') {
              router.push('/login');
            } else if (action === 'go to account setting page') {
              router.push('/account-setting');
            }
          }
        }}
      />
    </SafeAreaView>
  );
}

export default MyScreen;
