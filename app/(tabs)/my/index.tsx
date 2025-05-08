import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { router } from 'expo-router';

import { logout } from '@/apis/auth';
import Colors from '@/constants/colors';

function MyScreen() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.white }}>
      <WebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/mypage` }}
        onMessage={async () => {
          await logout();
          router.replace('/');
        }}
        javaScriptEnabled
        originWhitelist={['*']}
      />
    </SafeAreaView>
  );
}

export default MyScreen;
