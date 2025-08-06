import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
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
      try {
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
      } catch (error) {
        Alert.alert('로그인 상태를 확인하는 데 실패했습니다. 다시 시도해주세요.', (error as Error).message);
      }
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
