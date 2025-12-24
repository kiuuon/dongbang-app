import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

import CustomWebView from '@/components/common/CustomWebView';
import COLORS from '@/constants/colors';

function AnnouncementDetailScreen() {
  const { announcementId } = useLocalSearchParams();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/setting/announcement/${announcementId}` }}
        onMessage={() => {}}
      />
    </SafeAreaView>
  );
}

export default AnnouncementDetailScreen;
