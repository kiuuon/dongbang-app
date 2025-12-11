import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { usePathname, useRouter } from 'expo-router';
import { registerForPushNotifications } from '@/utils/pushNotifications';
import { fetchSession } from '@/apis/auth';
import { ERROR_MESSAGE } from '@/constants/error';
import { useQuery } from '@tanstack/react-query';
import { Alert } from 'react-native';

export function usePushNotifications() {
  const router = useRouter();
  const pathname = usePathname();

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const currentChatRoomIdRef = useRef<string>('');

  // currentChatRoomId가 변경될 때마다 ref 업데이트
  useEffect(() => {
    const chatRoomIdMatch = pathname.match(/^\/chats\/([^/]+)/);
    const currentChatRoomId = chatRoomIdMatch ? chatRoomIdMatch[1] : '';

    currentChatRoomIdRef.current = currentChatRoomId;
  }, [pathname]);

  useEffect(() => {
    // 앱 시작 시 푸시 토큰 등록
    registerForPushNotifications();

    // 포그라운드 알림 핸들러 설정 (현재 채팅방이면 알림 표시 안 함)
    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        const { data } = notification.request.content;

        // 현재 채팅방에 있으면 알림 무시
        if (data?.type === 'chat_message' && data?.chatRoomId === currentChatRoomIdRef.current) {
          return {
            shouldShowAlert: false,
            shouldPlaySound: false,
            shouldSetBadge: false,
          };
        }

        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        };
      },
    });

    // 포그라운드 알림 수신 처리
    notificationListener.current = Notifications.addNotificationReceivedListener(() => {
      console.log('notification received');
      Notifications.setBadgeCountAsync(0);
    });

    // 알림 탭 처리
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const { data } = response.notification.request.content;

      if (data.type === 'chat_message') {
        const { chatRoomId } = data;
        router.push(`/chats/${chatRoomId}`);
      }
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [router]);
}
