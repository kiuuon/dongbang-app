import { SafeAreaView } from 'react-native-safe-area-context';

import CustomWebView from '@/components/common/CustomWebView';
import COLORS from '@/constants/colors';

function NotificationSettingsSettingScreen() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/mypage/setting/notification-settings` }}
        onMessage={() => {}}
      />
    </SafeAreaView>
  );
}

export default NotificationSettingsSettingScreen;
