import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { usePathname, useRouter } from 'expo-router';
import { registerForPushNotifications } from '@/utils/pushNotifications';

export function usePushNotifications() {
  const router = useRouter();
  const pathname = usePathname();

  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
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
            shouldShowBanner: false,
            shouldShowList: false,
            shouldPlaySound: false,
            shouldSetBadge: false,
          };
        }

        return {
          shouldShowBanner: true,
          shouldShowList: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        };
      },
    });

    // 포그라운드 알림 수신 처리
    notificationListener.current = Notifications.addNotificationReceivedListener(() => {
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
  }, [router]);
}
