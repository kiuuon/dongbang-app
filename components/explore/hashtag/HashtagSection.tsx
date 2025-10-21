import {
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';

import COLORS from '@/constants/colors';
import { fetchHashtags } from '@/apis/feed';
import exploreStore from '@/stores/exploreStore';
import RegularText from '@/components/common/RegularText';
import FeedSection from '../feed/FeedSection';

function HashtagSection({ keyword }: { keyword: string }) {
  const selectedHashtag = exploreStore((state) => state.selectedHashtag);
  const setSelectedHashtag = exploreStore((state) => state.setSelectedHashtag);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['hashtags', keyword],
    queryFn: ({ pageParam }) => fetchHashtags(keyword, pageParam),
    getNextPageParam: (lastPage, allPages) => (lastPage?.length ? allPages.length : undefined),
    placeholderData: (prev) => prev,
    throwOnError: (error) => {
      Alert.alert('해시태그를 불러오는 데 실패했습니다.', error.message);
      return false;
    },
  });

  const hashtags = data?.pages.flat() ?? [];

  if (isPending) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (selectedHashtag === '') {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          data={hashtags}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.hashtagButton}
              onPress={() => setSelectedHashtag(item.name)}
            >
              <RegularText fontSize={18}>#{item.name}</RegularText>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
            ) : null
          }
        />
      </KeyboardAvoidingView>
    );
  }

  return <FeedSection keyword={selectedHashtag} />;
}

export default HashtagSection;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  hashtagButton: {
    height: 43,
    justifyContent: 'center',
  },
  footerLoader: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
