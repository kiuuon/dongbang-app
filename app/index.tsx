import { View, StyleSheet, Image, StatusBar } from 'react-native';

import KakaoLoginButton from '@/components/login/KakaoLoginButton';
import GoogleLoginButton from '@/components/login/GoogleLoginButton';
import Colors from '@/constants/colors';
import logo from '@/assets/images/logo.png';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.secondary} barStyle="dark-content" />
      <Image source={logo} style={styles.logo} resizeMode="contain" />
      <View style={styles.buttonContainer}>
        <KakaoLoginButton />
        <GoogleLoginButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    paddingHorizontal: 48,
    paddingTop: 210,
    gap: 172,
  },
  logo: {
    width: 140,
    height: 140,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
});
