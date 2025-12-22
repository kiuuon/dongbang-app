import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import CustomWebView from '@/components/common/CustomWebView';
import COLORS from '@/constants/colors';

function ClubAnnouncementDetailScreen() {
  const { clubId, announcementId } = useLocalSearchParams();

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/club/${clubId}/announcement/${announcementId}` }}
        onMessage={(event) => {
          const { type, action, payload } = event;
          if (type === 'event') {
            if (action === 'go to announcement edit page') {
              router.push(`/club/detail/${clubId}/announcement/${payload}/edit`);
            } else if (action === 'go to announcement list page') {
              router.push(`/club/detail/${clubId}/announcement`);
            } else if (action === 'go to profile page') {
              router.push(`/profile/${payload}`);
            }
          }
        }}
      />
    </SafeAreaView>
  );
}

export default ClubAnnouncementDetailScreen;
