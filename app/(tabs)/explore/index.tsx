import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import CustomWebView from '@/components/common/CustomWebView';
import Colors from '@/constants/colors';

function ExploreScreen() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/explore` }}
        onMessage={(event) => {
          if (JSON.parse(event.nativeEvent.data).message === 'go to feed detail page') {
            router.push(`/feed/detail/${JSON.parse(event.nativeEvent.data).feedId}`);
          }
        }}
      />
    </SafeAreaView>
  );
}

export default ExploreScreen;
