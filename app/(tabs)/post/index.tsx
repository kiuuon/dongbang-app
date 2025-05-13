import { SafeAreaView } from 'react-native-safe-area-context';

import CustomWebView from '@/components/common/CustomWebView';
import Colors from '@/constants/colors';

function PostScreen() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.white }}>
      <CustomWebView source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/post/my` }} onMessage={() => {}} />
    </SafeAreaView>
  );
}

export default PostScreen;
