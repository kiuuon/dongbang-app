import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

import CustomWebView from '@/components/common/CustomWebView';
import NavigationModal from '@/components/post/NavigationModal';
import Colors from '@/constants/colors';

function PostScreen() {
  const { clubType } = useLocalSearchParams();
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/post/${clubType}` }}
        onMessage={(event) => {
          if (event.nativeEvent.data === 'openNavigation') {
            setIsNavigationOpen(true);
          }
        }}
      />
      <NavigationModal visible={isNavigationOpen} onClose={() => setIsNavigationOpen(false)} />
    </SafeAreaView>
  );
}

export default PostScreen;
