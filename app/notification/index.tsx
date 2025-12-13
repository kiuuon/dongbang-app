import { useEffect } from 'react';
import { AppState, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';

import COLORS from '@/constants/colors';

function NotificationScreen() {
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        Notifications.setBadgeCountAsync(0);
      }
    });
    return () => sub.remove();
  }, []);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Text>Notification</Text>
    </SafeAreaView>
  );
}

export default NotificationScreen;
