import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

import CustomWebView from '@/components/common/CustomWebView';
import COLORS from '@/constants/colors';

function ClubAnnouncementEditScreen() {
  const { clubId, announcementId } = useLocalSearchParams();

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/club/${clubId}/announcement/${announcementId}/edit` }}
        onMessage={() => {}}
      />
    </SafeAreaView>
  );
}

export default ClubAnnouncementEditScreen;
