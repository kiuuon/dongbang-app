import { useEffect } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

import { fetchSession } from '@/apis/auth';
import { fetchUser } from '@/apis/user';

function Screen() {
  useEffect(() => {
    (async () => {
      try {
        const session = await fetchSession();
        const user = await fetchUser();

        await SplashScreen.hideAsync();

        if (session) {
          if (user) {
            router.replace('/feed/my');
          } else {
            router.replace('/sign-up/terms');
          }
        } else {
          router.replace('/login');
        }
      } catch (error) {
        if ((error as Error).message === 'User from sub claim in JWT does not exist') {
          AsyncStorage.clear();
        } else {
          Alert.alert('로그인 상태를 확인하는 데 실패했습니다. 다시 시도해주세요.', (error as Error).message);
        }
      }
    })();
  }, []);

  return null;
}

export default Screen;
