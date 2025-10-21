import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import CustomWebView from '@/components/common/CustomWebView';
import COLORS from '@/constants/colors';

function ClubCreateScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/club/create` }}
        onMessage={(data) => {
          const { type, action, payload } = data;
          if (type === 'event') {
            if (action === 'select club type') {
              const { clubType } = payload;
              if (clubType === 'campus') {
                router.push('/club/create/campus/info');
              } else if (clubType === 'union') {
                router.push('/club/create/union/info');
              }
            }
          }
        }}
      />
    </SafeAreaView>
  );
}

export default ClubCreateScreen;
