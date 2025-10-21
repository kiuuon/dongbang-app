import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { logout } from '@/apis/auth';
import CustomWebView from '@/components/common/CustomWebView';
import COLORS from '@/constants/colors';

function MyScreen() {
  const [key, setKey] = useState(0);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        key={key}
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/mypage` }}
        onMessage={async (data) => {
          const { type, action } = data;

          if (type === 'event') {
            if (action === 'go to login page') {
              router.push('/login');
            } else if (action === 'logout') {
              await logout();
              setKey((prev) => prev + 1);
            }
          }
        }}
      />
    </SafeAreaView>
  );
}

export default MyScreen;
