import { useState } from 'react';
import { View, Image, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { fetchAllClubs } from '@/apis/club';
import Colors from '@/constants/colors';
import BoldText from '@/components/common/SemiBoldText';

function ClubTagModal({
  selected,
  setSelected,
}: {
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [searchText, setSearchText] = useState('');

  const { data: clubs } = useQuery({
    queryKey: ['allClubs'],
    queryFn: () => fetchAllClubs(),
  });

  const selectClub = (selectedClubId: string) => {
    setSelected((prev) =>
      prev.includes(selectedClubId) ? prev.filter((id) => id !== selectedClubId) : [...prev, selectedClubId],
    );
  };

  const filteredClubs = clubs?.filter((club) => club.name?.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="검색"
        placeholderTextColor={Colors.gray2}
        value={searchText}
        onChangeText={setSearchText}
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
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
    marginTop: 23,
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
