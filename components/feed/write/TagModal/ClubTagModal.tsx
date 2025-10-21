import { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert, FlatList, ActivityIndicator } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { BottomSheetTextInput, BottomSheetModal } from '@gorhom/bottom-sheet';

import { fetchClubs } from '@/apis/club';
import COLORS from '@/constants/colors';
import BoldText from '@/components/common/SemiBoldText';

function ClubTagModal({
  clubId,
  selected,
  setSelected,
  bottomSheetModalRef,
}: {
  clubId: string;
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
}) {
  const [searchText, setSearchText] = useState('');

  const filters = {
    clubType: null,
    universityName: null,
    detailTypes: [],
    location: null,
    categories: [],
    recruitmentStatuses: [],
    endDateOption: null,
    meeting: null,
    duesOption: null,
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['clubs', searchText, filters],
    queryFn: ({ pageParam }) => fetchClubs(searchText, filters, pageParam),
    getNextPageParam: (lastPage, allPages) => (lastPage?.length ? allPages.length : undefined),
    throwOnError: (error) => {
      Alert.alert('동아리 목록을 불러오는 데 실패했습니다. 다시 시도해주세요.', error.message);
      return false;
    },
  });

  const clubs = data?.pages.flat() ?? [];

  const selectClub = (selectedClubId: string) => {
    setSelected((prev) =>
      prev.includes(selectedClubId) ? prev.filter((id) => id !== selectedClubId) : [...prev, selectedClubId],
    );
  };

  return (
    <View style={styles.container}>
      <BottomSheetTextInput
        style={styles.searchInput}
        placeholder="검색"
        placeholderTextColor={COLORS.gray2}
        value={searchText}
        onChangeText={setSearchText}
        onBlur={() => {
          bottomSheetModalRef.current?.snapToIndex(0);
        }}
      />
      <FlatList
        data={clubs}
        style={styles.scrollContainer}
        keyExtractor={(item) => item.id}
        renderItem={({ item: club }) =>
          club.id !== clubId ? (
            <View style={styles.clubRow}>
              <Image source={{ uri: club.logo }} style={styles.clubImage} />
              <TouchableOpacity style={styles.selectButtonContainer} onPress={() => selectClub(club.id)}>
                <BoldText fontSize={12}>{club.name}</BoldText>
                <View
                  style={[styles.selectButton, selected.includes(club.id) ? styles.selected : styles.notSelected]}
                />
              </TouchableOpacity>
            </View>
          ) : null
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator color="#F9A825" size="large" />
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
  },
  searchInput: {
    marginBottom: 20,
    marginTop: 24,
    height: 40,
    width: '100%',
    borderRadius: 10,
    backgroundColor: COLORS.gray0,
    paddingHorizontal: 13,
    fontFamily: 'PretendardRegular',
    fontStyle: 'normal',
    fontSize: 16,
  },
  scrollContainer: {
    width: '100%',
    height: 160,
  },
  clubRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  clubImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 29,
  },
  selectButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
    height: '100%',
  },
  selectButton: {
    width: 20,
    height: 20,
    borderRadius: '100%',
  },
  selected: {
    backgroundColor: COLORS.primary,
  },
  notSelected: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray2,
  },
});

export default ClubTagModal;
