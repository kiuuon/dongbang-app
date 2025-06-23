import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebViewMessageEvent } from 'react-native-webview';
import { router } from 'expo-router';

import CustomWebView from '@/components/common/CustomWebView';
import { fetchSession, login } from '@/apis/auth';
import { fetchUser } from '@/apis/user';
import Colors from '@/constants/colors';

function LoginScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const session = await fetchSession();
      const user = await fetchUser();
      if (session) {
        if (user) {
          router.replace('/feed/my');
        } else {
          router.replace('/sign-up/terms');
        }
      }
      setIsLoading(false);
    })();
  }, []);

  const handleMessage = async (event: WebViewMessageEvent) => {
    const { accessToken, refreshToken } = JSON.parse(event.nativeEvent.data);
    await login(accessToken, refreshToken);
    const user = await fetchUser();
    if (user) {
      router.replace('/feed/my');
    } else {
      router.replace('/sign-up/terms');
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
      <CustomWebView source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/login` }} onMessage={handleMessage} />
    </SafeAreaView>
  );
}

export default LoginScreen;
