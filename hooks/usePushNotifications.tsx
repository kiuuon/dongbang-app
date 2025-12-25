import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { usePathname, useRouter } from 'expo-router';
import { registerForPushNotifications } from '@/utils/pushNotifications';

export function usePushNotifications() {
  const router = useRouter();
  const pathname = usePathname();

  // 1. 마지막 알림 응답 확인용 훅 추가
  const lastResponse = Notifications.useLastNotificationResponse();

  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const currentChatRoomIdRef = useRef<string>('');
  const currentPathnameRef = useRef<string>('');

  // currentChatRoomId가 변경될 때마다 ref 업데이트
  useEffect(() => {
    const chatRoomIdMatch = pathname.match(/^\/chats\/([^/]+)/);
    const currentChatRoomId = chatRoomIdMatch ? chatRoomIdMatch[1] : '';

    currentChatRoomIdRef.current = currentChatRoomId;
    currentPathnameRef.current = pathname;
  }, [pathname]);

  // 2. 앱이 꺼진 상태(Terminated)에서 알림 클릭 시 처리
  useEffect(() => {
    if (lastResponse && lastResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
      const { data } = lastResponse.notification.request.content;

      // 내비게이션 준비 시간을 벌기 위해 아주 약간의 지연을 줍니다.
      const timeout = setTimeout(() => {
        if (data.type === 'chat_message' && data.chatRoomId) {
          router.push(`/chats/${data.chatRoomId}`);
        } else if (data.type === 'notification') {
          router.push('/notification');
        }
      }, 500);

      return () => clearTimeout(timeout);
    }
    return () => {};
  }, [lastResponse, router]); // lastResponse가 변경될 때마다 실행

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

        if (data?.type === 'notification' && currentPathnameRef.current === '/notification') {
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

      if (data.type === 'notification' && currentPathnameRef.current !== '/notification') {
        router.push('/notification');
      }
    });
  }, [router]);
}
