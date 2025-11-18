import { useRef, useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import WebView from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import CustomWebView from '@/components/common/CustomWebView';
import COLORS from '@/constants/colors';
import LoginModal from '@/components/common/LoginModal';

function ClubListScreen() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [key, setKey] = useState(0);

  const webViewRef = useRef<WebView>(null);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    webViewRef.current?.reload();
    setRefreshing(false);
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <CustomWebView
          key={key}
          setKey={setKey}
          ref={webViewRef}
          source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/club` }}
          onMessage={(data) => {
            const { type, action, payload } = data;
            if (type === 'event') {
              if (action === 'create club') {
                router.push('/club/create');
              } else if (action === 'go to club detail') {
                const clubId = payload;
                router.push(`/club/${clubId}`);
              } else if (action === 'open login modal') {
                setIsLoginModalOpen(true);
              }
            }
          }}
        />
      </ScrollView>

      <LoginModal visible={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} webViewRef={webViewRef} />
    </SafeAreaView>
  );
}

export default ClubListScreen;
