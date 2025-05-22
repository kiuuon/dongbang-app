import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { Tabs } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import TabBar from '@/components/common/TabBar';

function customTabBar(props: BottomTabBarProps) {
  const { state, navigation } = props;
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
      tabBar={customTabBar}
      screenOptions={() => ({
        headerShown: false,
        title: '',
        gestureEnabled: false,
      })}
    >
      <Tabs.Screen name="post/[clubType]/index" />
      <Tabs.Screen name="search/index" />
      <Tabs.Screen name="club/index" />
      <Tabs.Screen name="interact/index" />
      <Tabs.Screen name="my/index" />
    </Tabs>
  );
}
