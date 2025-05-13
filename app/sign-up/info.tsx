import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import CustomWebView from '@/components/common/CustomWebView';
import Colors from '@/constants/colors';
import termsStore from '@/stores/terms-store';
import { signUp } from '@/apis/user';

type RootStackParamList = {
  'sign-up/terms': undefined;
  'sign-up/info': undefined;
  'sign-up/complete': undefined;
};

type Navigation = NativeStackNavigationProp<RootStackParamList, 'sign-up/info'>;

function InfoScreen() {
  const navigation = useNavigation<Navigation>();
  const termOfUse = termsStore((state) => state.termOfUse);
  const privacyPolicy = termsStore((state) => state.privacyPolicy);
  const thirdPartyConsent = termsStore((state) => state.thirdPartyConsent);
  const marketing = termsStore((state) => state.marketing);

  useEffect(() => {
    if (!termOfUse || !privacyPolicy || !thirdPartyConsent) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'sign-up/terms' }],
      });
    }
  }, [termOfUse, privacyPolicy, thirdPartyConsent, navigation]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/sign-up/info` }}
        onMessage={(event) => {
          const body = {
            ...JSON.parse(event.nativeEvent.data),
            term_of_use: termOfUse,
            privacy_policy: privacyPolicy,
            third_party_consent: thirdPartyConsent,
            marketing,
          };

          signUp(body);

          navigation.reset({
            index: 0,
            routes: [{ name: 'sign-up/complete' }],
          });
        }}
      />
    </SafeAreaView>
  );
}

export default InfoScreen;
