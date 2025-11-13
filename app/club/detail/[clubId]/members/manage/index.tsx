import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomWebView from '@/components/common/CustomWebView';
import COLORS from '@/constants/colors';

function RecruitScreen() {
  const { clubId } = useLocalSearchParams();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/club/${clubId}/members/manage` }}
        onMessage={(data) => {
          const { type, action, payload } = data;
          if (type === 'event') {
            if (action === 'go to application page') {
              router.push(`/club/detail/${clubId}/members/manage/application`);
            } else if (action === 'go to profile page') {
              router.push(`/profile/${payload}`);
            } else if (action === 'go to member manage page') {
              router.push(`/club/detail/${clubId}/members/manage/${payload}`);
            }
          }
        }}
      />
    </SafeAreaView>
  );
}

export default RecruitScreen;
