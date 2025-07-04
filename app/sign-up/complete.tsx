import { SafeAreaView } from 'react-native-safe-area-context';

import { router } from 'expo-router';

import CustomWebView from '@/components/common/CustomWebView';
import Colors from '@/constants/colors';

function CompleteScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/sign-up/complete` }}
        onMessage={() => {
          router.push('/feed/my');
        }}
      />
    </SafeAreaView>
  );
}

export default CompleteScreen;
