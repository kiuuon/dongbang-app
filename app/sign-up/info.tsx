import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import CustomWebView from '@/components/common/CustomWebView';
import Colors from '@/constants/colors';

function InfoScreen() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/sign-up/info` }}
        onMessage={(event) => {
          console.log(event.nativeEvent.data);
          router.replace('/sign-up/complete');
        }}
      />
    </SafeAreaView>
  );
}

export default InfoScreen;
