import { useEffect } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';

import { fetchSession } from '@/apis/auth';
import { fetchUser } from '@/apis/user';

function Screen() {
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
        } else {
          router.replace('/login');
        }
      } catch (error) {
        Alert.alert('로그인 상태를 확인하는 데 실패했습니다. 다시 시도해주세요.', (error as Error).message);
      }
    })();
  }, []);

  return null;
}

export default Screen;
