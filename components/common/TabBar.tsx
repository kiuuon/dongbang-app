import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NavigationState, Route, ParamListBase, NavigationHelpers } from '@react-navigation/native';
import type { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs';

import Colors from '@/constants/colors';
import RegularText from '@/components/common/RegularText';

function TabBar({
  state,
  navigation,
}: {
  state: NavigationState;
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
}) {
  const icons: Record<string, 'home' | 'person'> = {
    'post/index': 'home',
    'search/index': 'home',
    'club/index': 'home',
    'interact/index': 'home',
    'my/index': 'person',
  };
  const titles: Record<string, string> = {
    'post/index': '홈',
    'search/index': '검색',
    'club/index': '동아리',
    'interact/index': '교류',
    'my/index': '프로필',
  };
  return (
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
            {icons[route.name] && (
              <Ionicons
                name={`${icons[route.name]}${isFocused ? '' : '-outline'}`}
                size={24}
                color={isFocused ? Colors.primary : '#A1A1A1'}
              />
            )}
            {titles[route.name] && <RegularText fontSize={12}>{titles[route.name]}</RegularText>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default TabBar;

const styles = StyleSheet.create({
  tabbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    height: 60,
    paddingHorizontal: 34,
  },
  item: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
  },
});
