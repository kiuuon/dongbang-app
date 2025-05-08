import { Tabs } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import TabBar from '@/components/common/TabBar';

function customTabBar(props: BottomTabBarProps) {
  const { state, navigation } = props;
  return <TabBar key={state.key} state={state} navigation={navigation} />;
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={customTabBar}
      screenOptions={() => ({
        headerShown: false,
        title: '',
      })}
    >
      <Tabs.Screen name="post/index" />
      <Tabs.Screen name="search/index" />
      <Tabs.Screen name="club/index" />
      <Tabs.Screen name="interact/index" />
      <Tabs.Screen name="my/index" />
    </Tabs>
  );
}
