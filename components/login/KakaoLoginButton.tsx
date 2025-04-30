import { TouchableOpacity, Text, Image, StyleSheet, View } from 'react-native';

import Colors from '@/constants/colors';
// import { login } from '@/lib/apis/auth';
import kakaoLogo from '@/assets/images/kakao_logo.png';

export default function KakaoLoginButton() {
  return (
    <TouchableOpacity style={styles.button} onPress={() => {}}>
      <View style={styles.content}>
        <Image source={kakaoLogo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.text}>카카오톡 계정으로 시작하기</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 51,
    width: '100%',
    borderRadius: 10,
    backgroundColor: Colors.kakao,
    justifyContent: 'center',
    paddingLeft: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 22,
  },
  logo: {
    width: 50,
    height: 50,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
  },
});
