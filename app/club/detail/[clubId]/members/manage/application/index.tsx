import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomWebView from '@/components/common/CustomWebView';
import COLORS from '@/constants/colors';

function ApplicationScreen() {
  const { clubId } = useLocalSearchParams();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/club/${clubId}/members/manage/application` }}
        onMessage={() => {}}
      />
    </SafeAreaView>
  );
}

export default ApplicationScreen;
