import { View, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import type { WebView as WebViewType } from 'react-native-webview';

import COLORS from '@/constants/colors';
import useTabVisibility from '@/stores/useTabVisibility';
import DongbangIcon from '@/icons/DongBangIcon';
import KakaoIcon from '@/icons/KakaoIcon';
import BoldText from './SemiBoldText';
import RegularText from './RegularText';

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  webViewRef: React.RefObject<WebViewType | null>;
}

export default function LoginModal({ visible, onClose, webViewRef }: LoginModalProps) {
  const { hide } = useTabVisibility();
  const handleLogin = (provider: 'kakao' | 'google') => {
    const message = {
      type: 'event',
      action: 'login request',
      payload: provider,
    };
    webViewRef.current?.postMessage(JSON.stringify(message));
    onClose();
    hide();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.container}>
          <View style={styles.logoWrapper}>
            <DongbangIcon />
            <BoldText fontSize={24}>동방</BoldText>
          </View>

          <BoldText fontSize={24} style={styles.description}>
            로그인하고 동방의{'\n'}모든 기능을 만나보세요!
          </BoldText>

          <RegularText fontSize={16} style={styles.subText}>
            더 많은 동아리 정보와 편리한 교류 기능을{'\n'}이용하려면 로그인이 필요해요.
          </RegularText>

          <TouchableOpacity style={[styles.loginButton, styles.kakao]} onPress={() => handleLogin('kakao')}>
            <KakaoIcon />
            <RegularText fontSize={16} style={styles.kakaoText}>
              카카오톡 계정으로 시작하기
            </RegularText>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <RegularText fontSize={16} style={styles.skipText}>
              다음에 할게요
            </RegularText>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.modalBackdrop,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    opacity: 1,
    alignItems: 'center',
    paddingVertical: 30,
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  description: {
    marginTop: 27,
    marginBottom: 40,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
  subText: {
    textAlign: 'center',
    color: COLORS.gray3,
    marginBottom: 40,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    height: 48,
    width: 292,
    paddingLeft: 27,
  },
  kakao: {
    backgroundColor: COLORS.kakao,
  },
  kakaoText: {
    flex: 1,
    textAlign: 'center',
  },
  skipText: {
    marginTop: 45,
    color: COLORS.gray3,
  },
});
