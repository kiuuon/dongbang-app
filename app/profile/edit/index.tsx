import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import COLORS from '@/constants/colors';
import CustomWebView from '@/components/common/CustomWebView';

function ProfileEditScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/profile/edit` }}
        onMessage={(data) => {
          const { type, action } = data;
          if (type === 'event') {
            if (action === 'complete edit profile') {
              router.replace('/my');
            }
          }
        }}
      />
    </SafeAreaView>
  );
}

export default ProfileEditScreen;
