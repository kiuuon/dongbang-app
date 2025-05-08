import { useEffect } from 'react';
import { View, Alert, StatusBar } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { router } from 'expo-router';

import { supabase } from '@/apis/supabaseClient';
import { login } from '@/apis/auth';

function LoginScreen() {
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace('/post');
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
      <WebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/login` }}
        onMessage={handleMessage}
        javaScriptEnabled
        originWhitelist={['*']}
      />
    </View>
  );
}

export default LoginScreen;
