import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { Tabs } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import TabBar from '@/components/common/TabBar';
import useTabVisibility from '@/stores/useTabVisibility';

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { hidden } = useTabVisibility();

  if (hidden) {
    return null;
  }

  return <TabBar key={state.key} state={state} navigation={navigation} />;
}

export default function TabLayout() {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <Tabs
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={() => ({
        headerShown: false,
        title: '',
        gestureEnabled: false,
      })}
    >
      <Tabs.Screen name="feed" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="club" />
      <Tabs.Screen name="interact" />
      <Tabs.Screen name="my" />
    </Tabs>
  );
}
