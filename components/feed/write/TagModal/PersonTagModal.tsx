import { useState } from 'react';
import { View, Image, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { fetchClubMembers } from '@/apis/club';
import Colors from '@/constants/colors';
import BoldText from '@/components/common/SemiBoldText';
import ToggleIcon2 from '@/icons/toggle-icon';

function PersonTagModal({
  selected,
  setSelected,
}: {
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const { clubId } = useLocalSearchParams();
  const [searchText, setSearchText] = useState('');

  const { data: members } = useQuery({
    queryKey: ['clubMembers', clubId],
    queryFn: () => fetchClubMembers(clubId as string),
  });

  const selectAllMembers = () => {
    if (selected.length === members?.length) {
      setSelected([]);
    } else {
      setSelected(members?.map((member) => member.userId) || []);
    }
  };

  const selectMember = (userId: string) => {
    setSelected((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
  };

  const filteredMembers = members?.filter((member) => member.name?.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <BoldText fontSize={12}>전체</BoldText>
        <TouchableOpacity onPress={selectAllMembers}>
          <ToggleIcon2 active={selected.length === members?.length} />
        </TouchableOpacity>
      </View>
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
        {filteredMembers?.map((member) => (
          <View key={member.userId} style={styles.memberRow}>
            {member.avatar ? (
              <Image source={{ uri: member.avatar }} style={styles.memberImage} />
            ) : (
              <View style={styles.tempImage} />
            )}
            <TouchableOpacity style={styles.selectButtonContainer} onPress={() => selectMember(member.userId)}>
              <BoldText fontSize={12}>{member.name}</BoldText>
              <View
                style={[styles.selectButton, selected.includes(member.userId) ? styles.selected : styles.notSelected]}
              />
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
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-end',
    gap: 8,
  },
  searchInput: {
    marginBottom: 20,
    marginTop: 4,
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
  memberRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  tempImage: {
    width: 40,
    height: 40,
    borderRadius: '100%',
    backgroundColor: Colors.black,
    marginRight: 29,
  },
  memberImage: {
    width: 40,
    height: 40,
    borderRadius: '100%',
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

export default PersonTagModal;
