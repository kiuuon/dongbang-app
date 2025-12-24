import { SafeAreaView } from 'react-native-safe-area-context';

import { router } from 'expo-router';

import CustomWebView from '@/components/common/CustomWebView';
import COLORS from '@/constants/colors';

function AnnouncementScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/setting/announcement` }}
        onMessage={(data) => {
          const { type, action, payload } = data;
          if (type === 'event') {
            if (action === 'go to announcement detail page') {
              router.push(`/setting/announcement/${payload}`);
            }
          }
        }}
      />
    </SafeAreaView>
  );
}

export default AnnouncementScreen;
