import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { logout } from '@/apis/auth';
import CustomWebView from '@/components/common/CustomWebView';
import COLORS from '@/constants/colors';

function AccountSettingScreen() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/mypage/setting` }}
        onMessage={async (data) => {
          const { type, action } = data;

          if (type === 'event') {
            if (action === 'logout') {
              await logout();
              router.back();
            }
          }
        }}
      />
    </SafeAreaView>
  );
}

export default AccountSettingScreen;
