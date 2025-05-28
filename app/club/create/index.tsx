import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import CustomWebView from '@/components/common/CustomWebView';
import Colors from '@/constants/colors';

function ClubCreateScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/club/create` }}
        onMessage={(event) => {
          if (event.nativeEvent.data === 'campus') {
            router.push('/club/create/campus/info');
          } else if (event.nativeEvent.data === 'union') {
            router.push('/club/create/union/info');
          }
        }}
      />
    </SafeAreaView>
  );
}

export default ClubCreateScreen;
