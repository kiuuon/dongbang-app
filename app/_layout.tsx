import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';

import pretendard from '@/assets/fonts/PretendardVariable.ttf';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Pretendard: pretendard,
  });

  if (!fontsLoaded) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}
