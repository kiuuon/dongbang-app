import { useEffect } from 'react';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import CustomWebView from '@/components/common/CustomWebView';
import COLORS from '@/constants/colors';
import termsStore from '@/stores/termsStore';
import { signUp } from '@/apis/user';
import { UserType } from '@/types/UserType';

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

  const { mutate: signUpMutation } = useMutation({
    mutationFn: (body: UserType) => signUp(body),
    onSuccess: () => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'sign-up/complete' }],
      });
    },
    onError: (error) => {
      Alert.alert('회원가입에 실패했습니다. 다시 시도해주세요.', error.message);
      navigation.reset({
        index: 0,
        routes: [{ name: 'sign-up/terms' }],
      });
    },
  });

  useEffect(() => {
    if (!termOfUse || !privacyPolicy || !thirdPartyConsent) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'sign-up/terms' }],
      });
    }
  }, [termOfUse, privacyPolicy, thirdPartyConsent, navigation]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/sign-up/info` }}
        onMessage={(data) => {
          const { type, action, payload } = data;
          if (type === 'event') {
            if (action === 'sign up') {
              const body = {
                ...payload,
                term_of_use: termOfUse,
                privacy_policy: privacyPolicy,
                third_party_consent: thirdPartyConsent,
                marketing,
              };

              signUpMutation(body);
            }
          }
        }}
      />
    </SafeAreaView>
  );
}

export default InfoScreen;
