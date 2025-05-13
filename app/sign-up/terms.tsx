import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import CustomWebView from '@/components/common/CustomWebView';
import Colors from '@/constants/colors';

function TermsScreen() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/sign-up/terms` }}
        onMessage={(event) => {
          console.log(event.nativeEvent.data);
          router.push('/sign-up/info');
        }}
      />
    </SafeAreaView>
  );
}

export default TermsScreen;
