import { TouchableOpacity, Text, Image, StyleSheet, View } from 'react-native';

// import { login } from '@/lib/apis/auth';
import Colors from '@/constants/colors';
import googleLogo from '@/assets/images/google_logo.png';

export default function GoogleLoginButton() {
  return (
    <TouchableOpacity style={styles.button} onPress={() => {}}>
      <View style={styles.content}>
        <Image source={googleLogo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.text}>구글 계정으로 시작하기</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 51,
    width: '100%',
    borderRadius: 10,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    paddingLeft: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
  },
  logo: {
    width: 36,
    height: 36,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
  },
});
