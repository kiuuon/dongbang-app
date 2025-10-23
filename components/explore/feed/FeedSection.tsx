import React from 'react';
import { View, ActivityIndicator, FlatList, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';

import COLORS from '@/constants/colors';
import { FeedType } from '@/types/FeedType';
import { searchFeeds } from '@/apis/feed/feed';
import FeedCard from './FeedCard';

function FeedSection({ keyword }: { keyword: string }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['feeds', keyword],
    queryFn: ({ pageParam }) => searchFeeds(keyword, pageParam),
    getNextPageParam: (lastPage, allPages) => (lastPage?.length ? allPages.length : undefined),
    placeholderData: (prev) => prev,
    throwOnError: (error) => {
      Alert.alert('피드를 불러오는 데 실패했습니다.', error.message);
      return false;
    },
  });

  const feeds = data?.pages.flat() ?? [];

  if (isPending) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        data={feeds}
        keyExtractor={(item: FeedType) => item.id}
        renderItem={({ item }) => <FeedCard feed={item} />}
        numColumns={2}
        columnWrapperStyle={{ columnGap: 13 }}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
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

export default FeedSection;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 80,
    gap: 11,
  },
  footerLoader: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
