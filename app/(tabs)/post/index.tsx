import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import Colors from '@/constants/colors';

function PostScreen() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.white }}>
      <WebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/post/my` }}
        onMessage={() => {}}
        javaScriptEnabled
        originWhitelist={['*']}
      />
    </SafeAreaView>
  );
}

export default PostScreen;
