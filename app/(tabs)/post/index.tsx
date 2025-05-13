import { useLayoutEffect } from 'react';
import { useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomWebView from '@/components/common/CustomWebView';
import Colors from '@/constants/colors';

function PostScreen() {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: '포스트',
      headerTintColor: 'black',
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: '600',
      },
    });
  }, [navigation]);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.white }}>
      <CustomWebView source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/post/my` }} onMessage={() => {}} />
    </SafeAreaView>
  );
}

export default PostScreen;
