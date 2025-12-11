/* eslint-disable no-console */
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from '@/apis/supabaseClient';

export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    console.warn('Must use physical device for Push Notifications');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Failed to get push token for push notification!');
    return null;
  }

  // Expo Push Token 가져오기
  const token = await Notifications.getExpoPushTokenAsync({
    projectId: '932000c0-3dbf-448f-b653-ef3f1d95a2d2', // app.json의 extra.eas.projectId
  });

  // Supabase에 토큰 저장
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.warn('User not authenticated');
    return null;
  }

  const deviceId = Device.modelId || 'unknown';
  const platform = Platform.OS;

  // 기존 토큰 비활성화
  await supabase
    .from('user_push_tokens')
    .update({ is_active: false })
    .eq('user_id', user.id)
    .eq('expo_push_token', token.data);

  // 새 토큰 저장
  const { error } = await supabase.from('user_push_tokens').upsert(
    {
      user_id: user.id,
      expo_push_token: token.data,
      device_id: deviceId,
      platform,
      is_active: true,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id,expo_push_token',
    },
  );

  if (error) {
    console.error('Error saving push token:', error);
    return null;
  }

  console.log('Push token registered:', token.data);
  return token.data;
}
