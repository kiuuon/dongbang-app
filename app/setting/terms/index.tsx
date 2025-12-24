import { Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import CustomWebView from '@/components/common/CustomWebView';
import COLORS from '@/constants/colors';

function TermsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/setting/terms` }}
        onMessage={(data) => {
          const { type, action, payload } = data;
          if (type === 'event') {
            if (action === 'go to terms detail page') {
              router.push(`/setting/terms/${payload}`);
            } else if (action === 'open GitHub repository') {
              Linking.openURL('https://github.com/kiuuon/dongbang-app');
            }
          }
        }}
      />
    </SafeAreaView>
  );
}

export default TermsScreen;
