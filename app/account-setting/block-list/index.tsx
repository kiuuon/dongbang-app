import { SafeAreaView } from 'react-native-safe-area-context';

import CustomWebView from '@/components/common/CustomWebView';
import COLORS from '@/constants/colors';

function BlockListSettingScreen() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/mypage/setting/block-list` }}
        onMessage={() => {}}
      />
    </SafeAreaView>
  );
}

export default BlockListSettingScreen;
