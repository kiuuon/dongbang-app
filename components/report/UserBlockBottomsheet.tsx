import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import type { WebView as WebViewType } from 'react-native-webview';

import { blockUser } from '@/apis/user';
import { ERROR_MESSAGE } from '@/constants/error';
import COLORS from '@/constants/colors';
import RegularText from '../common/RegularText';
import BoldText from '../common/SemiBoldText';

function UserBlockBottomsheet({
  userInfo,
  onClose,
  webViewRef,
}: {
  userInfo: { userId: string; username: string; nickname: string } | null;
  onClose: () => void;
  webViewRef: React.RefObject<WebViewType | null>;
}) {
  const { mutate: handleBlockUser } = useMutation({
    mutationFn: () => blockUser(userInfo?.userId as string),
    onSuccess: () => {
      onClose();

      const message = {
        type: 'event',
        action: 'block user in Profile',
        payload: userInfo?.nickname,
      };

      webViewRef.current?.postMessage(JSON.stringify(message));
    },
    onError: (error) => Alert.alert(ERROR_MESSAGE.USER.BLOCK_FAILED, error.message),
  });

  return (
    <View style={styles.container}>
      <RegularText fontSize={12} style={{ color: COLORS.gray1 }}>
        사용자를 차단할 수 있어요. 차단하면 서로의 피드와 댓글, 동아리 활동을 더 이상 볼 수 없습니다.
      </RegularText>

      <TouchableOpacity style={styles.blockButton} onPress={() => handleBlockUser()}>
        <BoldText fontSize={12} style={{ color: COLORS.white }}>
          {userInfo?.username}({userInfo?.nickname}) 차단
        </BoldText>
      </TouchableOpacity>

      <RegularText fontSize={12} style={{ color: COLORS.gray1, marginBottom: 20 }}>
        차단상태는 계정 관리 &gt; 차단 목록에서 언제든 해제할 수 있습니다.
      </RegularText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },

  blockButton: {
    marginTop: 18,
    marginBottom: 32,
    paddingVertical: 21,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
});

export default UserBlockBottomsheet;
