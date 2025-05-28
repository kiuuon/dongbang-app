import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import CustomWebView from '@/components/common/CustomWebView';
import Colors from '@/constants/colors';

function ClubListScreen() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/club` }}
        onMessage={(event) => {
          if (event.nativeEvent.data === 'create club') {
            router.push('/club/create');
          } else {
            const clubId = event.nativeEvent.data;
            router.push(`/club/${clubId}`);
          }
        }}
      />
    </SafeAreaView>
  );
}

export default ClubListScreen;
