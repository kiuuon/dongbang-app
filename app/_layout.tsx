import { useState } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';

import pretendardRegular from '@/assets/fonts/Pretendard-Regular.otf';
import pretendardSemiBold from '@/assets/fonts/Pretendard-SemiBold.otf';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  const [fontsLoaded] = useFonts({
    PretendardRegular: pretendardRegular,
    PretendardSemiBold: pretendardSemiBold,
  });

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
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
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
