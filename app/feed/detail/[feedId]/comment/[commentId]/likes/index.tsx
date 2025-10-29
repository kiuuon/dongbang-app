import { SafeAreaView } from 'react-native-safe-area-context';

import CustomWebView from '@/components/common/CustomWebView';
import COLORS from '@/constants/colors';
import { useLocalSearchParams } from 'expo-router';

function CommentLikesScreen() {
  const { feedId, commentId } = useLocalSearchParams();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/feed/detail/${feedId}/comment/${commentId}/likes` }}
        onMessage={() => {}}
      />
    </SafeAreaView>
  );
}

export default CommentLikesScreen;
