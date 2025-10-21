import { SafeAreaView } from 'react-native-safe-area-context';

import CustomWebView from '@/components/common/CustomWebView';
import COLORS from '@/constants/colors';

function LoginScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <CustomWebView source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/login` }} onMessage={() => {}} />
    </SafeAreaView>
  );
}

export default LoginScreen;
