import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import Colors from '@/constants/colors';
import CustomWebView from '@/components/common/CustomWebView';
import NavigationModal from '@/components/club/NavigationModal';

function ClubScreen() {
  const { clubId } = useLocalSearchParams();
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/club/${clubId}` }}
        onMessage={(event) => {
          if (event.nativeEvent.data === 'openNavigation') {
            setIsNavigationOpen(true);
          } else if (event.nativeEvent.data === 'comingSoon') {
            router.push('/coming-soon');
          } else if (event.nativeEvent.data === 'go to write feed page') {
            router.push(`/feed/write/${clubId}`);
          }
        }}
      />
      <NavigationModal visible={isNavigationOpen} onClose={() => setIsNavigationOpen(false)} />
    </SafeAreaView>
  );
}

export default ClubScreen;
