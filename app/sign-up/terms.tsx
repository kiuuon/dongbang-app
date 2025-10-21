import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import CustomWebView from '@/components/common/CustomWebView';
import COLORS from '@/constants/colors';
import termsStore from '@/stores/termsStore';

function TermsScreen() {
  const setTermOfUse = termsStore((state) => state.setTermOfUse);
  const setPrivacyPolicy = termsStore((state) => state.setPrivacyPolicy);
  const setThirdPartyConsent = termsStore((state) => state.setThirdPartyConsent);
  const setMarketing = termsStore((state) => state.setMarketing);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/sign-up/terms` }}
        onMessage={(event) => {
          const { termOfUse, privacyPolicy, thirdPartyConsent, marketing } = JSON.parse(event.nativeEvent.data);
          setTermOfUse(termOfUse);
          setPrivacyPolicy(privacyPolicy);
          setThirdPartyConsent(thirdPartyConsent);
          setMarketing(marketing);

          router.push('/sign-up/info');
        }}
      />
    </SafeAreaView>
  );
}

export default TermsScreen;
