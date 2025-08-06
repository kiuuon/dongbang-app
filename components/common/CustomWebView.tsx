import { useRef } from 'react';
import { Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebView as WebViewType, WebViewMessageEvent } from 'react-native-webview';
import { useNavigation } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { fetchSession } from '@/apis/auth';

function CustomWebView({
  source,
  onMessage,
}: {
  source: { uri: string };
  onMessage: (event: WebViewMessageEvent) => void;
}) {
  const navigation = useNavigation();
  const webViewRef = useRef<WebViewType | null>(null);
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    throwOnError: (error) => {
      Alert.alert('세션 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.', error.message);
      return false;
    },
  });

  const sendTokenToWeb = async () => {
    if (!session) return;
    const { access_token: accessToken, refresh_token: refreshToken } = session;
    const jsCode = `
      window.postMessage(${JSON.stringify({ accessToken, refreshToken })}, "*");
      true;
    `;
    webViewRef.current?.injectJavaScript(jsCode);
  };

  return (
    <WebView
      ref={webViewRef}
      source={source}
      onLoadEnd={sendTokenToWeb}
      onMessage={(event) => {
        let data;

        try {
          data = JSON.parse(event.nativeEvent.data);
        } catch {
          data = event.nativeEvent.data;
        }

        if (data === 'back') {
          navigation.goBack();
          return;
        }

        if (data.type === 'error') {
          Alert.alert(data.headline, data.message);
          return;
        }

        onMessage(event);
      }}
      javaScriptEnabled
      originWhitelist={['*']}
      userAgent="rn-webview"
    />
  );
}

export default CustomWebView;
