import { useState } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';

import pretendardRegular from '@/assets/fonts/Pretendard-Regular.otf';
import pretendardSemiBold from '@/assets/fonts/Pretendard-SemiBold.otf';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useRealtime } from '@/hooks/useRealTime';

export const unstable_settings = {
  initialRouteName: 'index',
};

function RealTimeProvider() {
  useRealtime();

  return null;
}
export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const [fontsLoaded] = useFonts({
    PretendardRegular: pretendardRegular,
    PretendardSemiBold: pretendardSemiBold,
  });

  usePushNotifications();

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RealTimeProvider />
        <BottomSheetModalProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen
              name="(tabs)"
              options={{
                gestureEnabled: false,
              }}
            />
          </Stack>
          <Toast position="top" visibilityTime={3000} bottomOffset={50} />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
