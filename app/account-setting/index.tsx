import { useRef, useState } from 'react';
import { router } from 'expo-router';
import { Alert, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import type { WebView as WebViewType } from 'react-native-webview';

import { logout } from '@/apis/auth';
import { supabase } from '@/apis/supabaseClient';
import { ERROR_MESSAGE } from '@/constants/error';
import COLORS from '@/constants/colors';
import CustomWebView from '@/components/common/CustomWebView';
import CustomBottomSheet from '@/components/common/CustomBottomSheet';
import BoldText from '@/components/common/SemiBoldText';
import RegularText from '@/components/common/RegularText';

function AccountSettingScreen() {
  const queryClient = useQueryClient();
  const webViewRef = useRef<WebViewType | null>(null);

  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [isWithdrawalAgreed, setIsWithdrawalAgreed] = useState(false);

  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
      router.replace('/login');

      await Notifications.setBadgeCountAsync(0);
    },
    onError: (error) => Alert.alert(ERROR_MESSAGE.AUTH.LOGOUT_FAILED, error.message),
  });

  const handleWithdrawal = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Edge Function 호출
      const { error } = await supabase.functions.invoke('delete-user', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      // 탈퇴 성공 시 처리
      Alert.alert('회원 탈퇴가 완료되었습니다.');

      // 로그아웃 처리 및 메인 이동
      await supabase.auth.signOut();
      router.dismissAll();
      router.replace('/');

      const message = {
        type: 'event',
        action: 'not logged in',
      };
      webViewRef.current?.postMessage(JSON.stringify(message));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('탈퇴 처리 중 오류:', error);
      Alert.alert('탈퇴 처리에 실패했습니다. 고객센터에 문의해주세요.');
    }
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        ref={webViewRef}
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/mypage/setting` }}
        onMessage={async (data) => {
          const { type, action } = data;

          if (type === 'event') {
            if (action === 'logout') {
              mutate();
              router.back();
            } else if (action === 'click edit profile button') {
              router.push('/profile/edit');
            } else if (action === 'go to profile visibility page') {
              router.push('/account-setting/profile-visibility');
            } else if (action === 'go to block list page') {
              router.push('/account-setting/block-list');
            } else if (action === 'go to notification settings page') {
              router.push('/account-setting/notification-settings');
            } else if (action === 'open withdrawal modal') {
              setIsWithdrawalModalOpen(true);
            }
          }
        }}
      />

      <CustomBottomSheet isOpen={isWithdrawalModalOpen} onClose={() => setIsWithdrawalModalOpen(false)}>
        <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
          <BoldText fontSize={14} style={{ color: COLORS.error, marginBottom: 8 }}>
            회원 탈퇴
          </BoldText>
          <RegularText fontSize={12}>탈퇴 문구</RegularText>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 19 }}
            onPress={() => setIsWithdrawalAgreed(!isWithdrawalAgreed)}
          >
            <View
              style={{
                width: 14,
                height: 14,
                borderRadius: 2,
                backgroundColor: isWithdrawalAgreed ? COLORS.primary : COLORS.gray0,
              }}
            />
            <RegularText fontSize={12}>동의합니다.</RegularText>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: isWithdrawalAgreed ? COLORS.error : COLORS.gray0,
              paddingVertical: 21,
              borderRadius: 24,
            }}
            onPress={() => handleWithdrawal()}
          >
            <BoldText fontSize={12} style={{ color: COLORS.white, textAlign: 'center' }}>
              탈퇴 하기
            </BoldText>
          </TouchableOpacity>
        </View>
      </CustomBottomSheet>
    </SafeAreaView>
  );
}

export default AccountSettingScreen;
