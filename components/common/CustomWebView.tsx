import { useRef } from 'react';
import { WebView } from 'react-native-webview';
import type { WebView as WebViewType, WebViewMessageEvent } from 'react-native-webview';

import { fetchSession } from '@/apis/auth';

function CustomWebView({
  source,
  onMessage,
}: {
  source: { uri: string };
  onMessage: (event: WebViewMessageEvent) => void;
}) {
  const webViewRef = useRef<WebViewType | null>(null);

  const sendTokenToWeb = async () => {
    const session = await fetchSession();
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
      onMessage={onMessage}
      javaScriptEnabled
      originWhitelist={['*']}
      userAgent="rn-webview"
    />
  );
}

export default CustomWebView;
