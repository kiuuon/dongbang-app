import { useState } from 'react';
import { View, Image, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { BottomSheetTextInput, BottomSheetModal } from '@gorhom/bottom-sheet';

import { fetchAllClubs } from '@/apis/club';
import Colors from '@/constants/colors';
import BoldText from '@/components/common/SemiBoldText';

function ClubTagModal({
  selected,
  setSelected,
  bottomSheetModalRef,
}: {
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
}) {
  const [searchText, setSearchText] = useState('');

  const { data: clubs } = useQuery({
    queryKey: ['allClubs'],
    queryFn: () => fetchAllClubs(),
    throwOnError: (error) => {
      Alert.alert('동아리 목록을 불러오는 데 실패했습니다. 다시 시도해주세요.', error.message);
      return false;
    },
  });

  const selectClub = (selectedClubId: string) => {
    setSelected((prev) =>
      prev.includes(selectedClubId) ? prev.filter((id) => id !== selectedClubId) : [...prev, selectedClubId],
    );
  };

  const filteredClubs = clubs?.filter((club) => club.name?.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <View style={styles.container}>
      <BottomSheetTextInput
        style={styles.searchInput}
        placeholder="검색"
        placeholderTextColor={Colors.gray2}
        value={searchText}
        onChangeText={setSearchText}
        onBlur={() => {
          bottomSheetModalRef.current?.snapToIndex(0);
        }}
      />
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        {filteredClubs?.map((club) => (
          <View key={club.id} style={styles.clubRow}>
            <Image source={{ uri: club.logo }} style={styles.clubImage} />
            <TouchableOpacity style={styles.selectButtonContainer} onPress={() => selectClub(club.id)}>
              <BoldText fontSize={12}>{club.name}</BoldText>
              <View style={[styles.selectButton, selected.includes(club.id) ? styles.selected : styles.notSelected]} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  searchInput: {
    marginBottom: 20,
    marginTop: 24,
    height: 40,
    width: '100%',
    borderRadius: 10,
    backgroundColor: Colors.gray0,
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
    backgroundColor: Colors.primary,
  },
  notSelected: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray2,
  },
});

export default ClubTagModal;
