import { useEffect, useRef, useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import WebView from 'react-native-webview';

import COLORS from '@/constants/colors';
import CustomWebView from '@/components/common/CustomWebView';

function NotificationScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    webViewRef.current?.reload();
    setRefreshing(false);
  };
  useEffect(() => {
    Notifications.setBadgeCountAsync(0);
  }, []);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <CustomWebView
          ref={webViewRef}
          source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/notification` }}
          onMessage={(data) => {
            const { type, action, payload } = data;
            if (type === 'event') {
              if (action === 'click notification') {
                const { navigationType, navigationId } = payload;
                if (navigationType === 'feed') {
                  router.push(`/feed/detail/${navigationId}`);
                } else if (navigationType === 'application') {
                  router.push(`/club/detail/${navigationId}/members/manage/application`);
                } else if (navigationType === 'club') {
                  router.push(`/club/detail/${navigationId}`);
                } else if (navigationType === 'inquiry') {
                  router.push(`/club/detail/${navigationId}`);
                }
              } else if (action === 'click announcement notification') {
                const { navigationId, clubId } = payload;
                router.push(`/club/detail/${clubId}/announcement/${navigationId}`);
              }
            }
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default NotificationScreen;
