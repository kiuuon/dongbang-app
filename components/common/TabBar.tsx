import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NavigationState, Route, ParamListBase, NavigationHelpers } from '@react-navigation/native';
import type { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs';

import COLORS from '@/constants/colors';
import RegularText from '@/components/common/RegularText';
import HomeIcon from '@/icons/home-icon';
import SearchIcon from '@/icons/search-icon';
import ClubIcon from '@/icons/club-icon';
import InteractIcon from '@/icons/interact-icon';
import ProfileIcon from '@/icons/profile-icon';

const titles: Record<string, string> = {
  'feed/[clubType]/index': '홈',
  'explore/index': '검색',
  'club/index': '동아리',
  'interact/index': '교류',
  'my/index': '프로필',
};

const icons: Record<string, (props: { color: string }) => JSX.Element> = {
  'feed/[clubType]/index': ({ color }) => <HomeIcon color={color} />,
  'explore/index': ({ color }) => <SearchIcon color={color} />,
  'club/index': ({ color }) => <ClubIcon color={color} />,
  'interact/index': ({ color }) => <InteractIcon color={color} />,
  'my/index': ({ color }) => <ProfileIcon color={color} />,
};

function TabBar({
  state,
  navigation,
}: {
  state: NavigationState;
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
}) {
  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.tabbar}>
        {state.routes.map((route: Route<string>, index: number) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.name}
              style={styles.item}
              accessibilityRole="button"
              onPress={onPress}
              onLongPress={onLongPress}
            >
              {icons[route.name] && icons[route.name]({ color: isFocused ? COLORS.primary : COLORS.gray2 })}
              {titles[route.name] && <RegularText fontSize={12}>{titles[route.name]}</RegularText>}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

export default TabBar;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.white,
  },
  tabbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    height: 70,
    paddingHorizontal: 34,
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
  },
  item: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
  },
});
