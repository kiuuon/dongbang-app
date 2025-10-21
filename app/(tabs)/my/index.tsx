import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { logout } from '@/apis/auth';
import CustomWebView from '@/components/common/CustomWebView';
import COLORS from '@/constants/colors';

function MyScreen() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/mypage` }}
        onMessage={async () => {
          await logout();
          router.replace('/');
        }}
      />
    </SafeAreaView>
  );
}

export default MyScreen;
