import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { logout } from '@/apis/auth';
import CustomWebView from '@/components/common/CustomWebView';
import COLORS from '@/constants/colors';
import { ERROR_MESSAGE } from '@/constants/error';
import { Alert } from 'react-native';

function AccountSettingScreen() {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      router.replace('/login');
    },
    onError: (error) => Alert.alert(ERROR_MESSAGE.AUTH.LOGOUT_FAILED, error.message),
  });

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/mypage/setting` }}
        onMessage={(data) => {
          const { type, action } = data;

          if (type === 'event') {
            if (action === 'logout') {
              mutate();
              router.back();
            } else if (action === 'click edit profile button') {
              router.push('/profile/edit');
            } else if (action === 'go to profile visibility page') {
              router.push('/account-setting/profile-visibility');
            }
          }
        }}
      />
    </SafeAreaView>
  );
}

export default AccountSettingScreen;
