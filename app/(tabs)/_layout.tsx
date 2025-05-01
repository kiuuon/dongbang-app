import { Tabs } from 'expo-router';

import TabBar from '@/components/common/TabBar';

function customTabBar(props: any) {
  const { key, state, navigation } = props;
  return <TabBar key={key} state={state} navigation={navigation} />;
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
    </Tabs>
  );
}
