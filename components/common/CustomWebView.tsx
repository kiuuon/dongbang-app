import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebView as WebViewType } from 'react-native-webview';
import { useNavigation, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { fetchSession, login } from '@/apis/auth';
import { fetchUser } from '@/apis/user';
import { registerForPushNotifications } from '@/utils/pushNotifications';
import { ERROR_MESSAGE } from '@/constants/error';
import useTabVisibility from '@/stores/useTabVisibility';

type CustomWebViewProps = {
  source: { uri: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMessage: (event: any) => void;
  onLoadEnd?: () => void;
  setKey?: React.Dispatch<React.SetStateAction<number>>;
};

const CustomWebView = forwardRef<WebViewType, CustomWebViewProps>(
  ({ source, onMessage, onLoadEnd = () => {}, setKey = () => {} }, ref) => {
    const navigation = useNavigation();
    const webViewRef = useRef<WebViewType | null>(null);
    const { show } = useTabVisibility();
    const { data: session } = useQuery({
      queryKey: ['session'],
      queryFn: fetchSession,
      throwOnError: (error) => {
        Alert.alert(ERROR_MESSAGE.SESSION.FETCH_FAILED, error.message);
        return false;
      },
    });

    useImperativeHandle(ref, () => webViewRef.current as WebViewType, []);

    const sendTokenToWeb = async () => {
      if (!session) {
        return;
      }

      const { access_token: accessToken, refresh_token: refreshToken } = session;

      const message = {
        type: 'event',
        action: 'set session request',
        payload: { accessToken, refreshToken },
      };

      webViewRef.current?.postMessage(JSON.stringify(message));
    };

    return (
      <WebView
        ref={webViewRef}
        source={source}
        cacheEnabled={false}
        hideKeyboardAccessoryView
        onLoadEnd={() => {
          onLoadEnd();
          sendTokenToWeb();
        }}
        onMessage={async (event) => {
          let data;

          try {
            data = JSON.parse(event.nativeEvent.data);
          } catch {
            data = event.nativeEvent.data;
          }

          const { type, action, payload } = data;

          if (type === 'event') {
            if (action === 'login success') {
              show();
              registerForPushNotifications();
              await login(payload.accessToken, payload.refreshToken);
              setKey((prev) => prev + 1); // 웹뷰 리로드
              const user = await fetchUser();
              if (user) {
                router.replace('/feed/my');
              } else {
                router.replace('/sign-up/terms');
              }
            } else if (action === 'back button click') {
              navigation.goBack();
            } else if (action === 'go to home') {
              router.replace('/');
            }
          }

          if (data.type === 'error') {
            Alert.alert(data.headline, data.message);
            return;
          }

          onMessage(data);
        }}
        javaScriptEnabled
        originWhitelist={['*']}
        userAgent="rn-webview"
      />
    );
  },
);

export default CustomWebView;
