import { useEffect } from 'react';
import { View, Alert, StatusBar } from 'react-native';
import { WebViewMessageEvent } from 'react-native-webview';
import { router } from 'expo-router';

import CustomWebView from '@/components/common/CustomWebView';
import { fetchSession, login } from '@/apis/auth';
import { fetchUser } from '@/apis/user';

function LoginScreen() {
  useEffect(() => {
    (async () => {
      const session = await fetchSession();
      const user = await fetchUser();
      if (session) {
        if (user) {
          router.replace('/post');
        } else {
          router.replace('/sign-up/terms');
        }
      }
    })();
  }, []);

  const handleMessage = async (event: WebViewMessageEvent) => {
    try {
      const { accessToken, refreshToken } = JSON.parse(event.nativeEvent.data);
      await login(accessToken, refreshToken);
      router.replace('/post');
    } catch (err) {
      Alert.alert('메시지 파싱 실패', String(err));
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#FFE6A1" barStyle="dark-content" />
      <CustomWebView source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/login` }} onMessage={handleMessage} />
    </View>
  );
}

export default LoginScreen;
