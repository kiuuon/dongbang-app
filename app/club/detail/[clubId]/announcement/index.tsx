import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import CustomWebView from '@/components/common/CustomWebView';
import COLORS from '@/constants/colors';

function ClubAnnouncementScreen() {
  const { clubId } = useLocalSearchParams();

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/club/${clubId}/announcement` }}
        onMessage={(event) => {
          const { type, action, payload } = event;
          if (type === 'event') {
            if (action === 'go to announcement detail page') {
              router.push(`/club/detail/${clubId}/announcement/${payload}`);
            } else if (action === 'write announcement') {
              router.push(`/club/detail/${clubId}/announcement/write`);
            }
          }
        }}
      />
    </SafeAreaView>
  );
}

export default ClubAnnouncementScreen;
