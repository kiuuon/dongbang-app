import { SafeAreaView } from 'react-native-safe-area-context';

import CustomWebView from '@/components/common/CustomWebView';
import COLORS from '@/constants/colors';
import { router, useLocalSearchParams } from 'expo-router';

function CommentLikesScreen() {
  const { feedId, commentId } = useLocalSearchParams();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/feed/detail/${feedId}/comment/${commentId}/likes` }}
        onMessage={(data) => {
          const { type, action, payload } = data;
          if (type === 'event') {
            if (action === 'go to profile page') {
              router.push(`/profile/${payload}`);
            }
          }
        }}
      />
    </SafeAreaView>
  );
}

export default CommentLikesScreen;
