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

  // 기존 토큰 확인
  const { data: existingToken, error: checkError } = await supabase
    .from('user_push_tokens')
    .select('id')
    .eq('user_id', user.id)
    .eq('expo_push_token', token.data)
    .maybeSingle();

  if (checkError && checkError.code !== 'PGRST116') {
    console.error('Error checking existing token:', checkError);
    return null;
  }

  const tokenData = {
    user_id: user.id,
    expo_push_token: token.data,
    device_id: deviceId,
    platform,
    is_active: true,
    updated_at: new Date().toISOString(),
  };

  // 기존 토큰이 있으면 업데이트, 없으면 insert
  let error;
  if (existingToken) {
    const { error: updateError } = await supabase.from('user_push_tokens').update(tokenData).eq('id', existingToken.id);
    error = updateError;
  } else {
    console.log('insert tokenData', tokenData);
    const { error: insertError } = await supabase.from('user_push_tokens').insert([tokenData]);

    error = insertError;
  }

  if (error) {
    // Foreign key constraint 에러인 경우 무시 (User가 아직 생성되지 않음)
    if (error.code === '23503') {
      console.warn('Foreign key constraint error - User may not be created yet:', error.message);
      return null;
    }

    console.error('Error saving push token:', error);
    return null;
  }

  console.log('Push token registered:', token.data);
  return token.data;
}
