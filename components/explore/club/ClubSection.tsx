import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { fetchClubs, fetchClubsCount } from '@/apis/club';
import COLORS from '@/constants/colors';
import { ERROR_MESSAGE } from '@/constants/error';
import filtersStore from '@/stores/filterStore';
import CustomBottomSheet from '@/components/common/CustomBottomSheet';
import RegularText from '@/components/common/RegularText';
import ClubCard from './ClubCard';
import DetailSearchModal from './detail-search-modal/DetailSearchModal';

function ClubSection({
  keyword,
  isDetailSearchModalOpen,
  setIsDetailSearchModalOpen,
}: {
  keyword: string;
  isDetailSearchModalOpen: boolean;
  setIsDetailSearchModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { filters } = filtersStore();
  const [openClubCardId, setOpenClubCardId] = useState<string | null>(null);

  // 동아리 개수
  const { data: clubCount } = useQuery({
    queryKey: ['clubCount', keyword, filters],
    queryFn: () => fetchClubsCount(keyword, filters),
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.CLUB.COUNT_FETCH_FAILED, error.message);
      return false;
    },
  });

  // 동아리 리스트 (무한스크롤)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['clubs', keyword, filters],
    queryFn: ({ pageParam }) => fetchClubs(keyword, filters, pageParam),
    getNextPageParam: (lastPage, allPages) => (lastPage?.length ? allPages.length : undefined),
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.CLUB.LIST_FETCH_FAILED, error.message);
      return false;
    },
  });

  const clubs = data?.pages.flat() ?? [];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        <FlatList
          data={clubs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ClubCard club={item} openClubCardId={openClubCardId} setOpenClubCardId={setOpenClubCardId} />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListHeaderComponent={
            !isPending ? (
              <RegularText fontSize={12} style={styles.countText}>
                총 {clubCount}건
              </RegularText>
            ) : null
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
            ) : null
          }
        />

        <CustomBottomSheet
          indicator={false}
          backgroundColor={COLORS.background}
          isOpen={isDetailSearchModalOpen}
          onClose={() => setIsDetailSearchModalOpen(false)}
        >
          <DetailSearchModal setIsDetailSearchModalOpen={setIsDetailSearchModalOpen} />
        </CustomBottomSheet>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  countText: {
    marginLeft: 20,
    marginBottom: 10,
    paddingTop: 15,
    color: COLORS.gray2,
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 20,
    gap: 8,
  },
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default ClubSection;
