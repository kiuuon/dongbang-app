import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import COLORS from '@/constants/colors';
import CustomWebView from '@/components/common/CustomWebView';

function LoginScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/login` }}
        onMessage={(data) => {
          const { type, action } = data;

          if (type === 'event') {
            if (action === 'look around') {
              router.push('/feed/all');
            }
          }
        }}
      />
    </SafeAreaView>
  );
}

export default LoginScreen;
