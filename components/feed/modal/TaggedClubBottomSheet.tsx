import { router } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';

import COLORS from '@/constants/colors';
import BoldText from '@/components/common/SemiBoldText';

function TaggedClubBottomSheet({
  taggedClubs,
  onClose,
  currentPath,
}: {
  taggedClubs: { club: { id: string; name: string; logo: string } }[];
  onClose: () => void;
  currentPath: '' | '/my' | '/feed' | '/explore' | '/interact' | '/club' | '/feed/detail';
}) {
  return (
    <View style={styles.container}>
      {taggedClubs.map(({ club }) => (
        <TouchableOpacity
          key={club.logo}
          style={styles.button}
          onPress={() => {
            onClose();
            if (currentPath === '/feed/detail') {
              router.push(`/club/detail/${club.id}`);
            } else {
              router.push(`${currentPath}/club/${club.id}`);
            }
          }}
        >
          <Image source={{ uri: club.logo }} style={styles.clubImage} />
          <BoldText fontSize={12}>{club.name}</BoldText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },
  button: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 29,
  },
  clubImage: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.background,
    borderRadius: 5,
  },
});

export default TaggedClubBottomSheet;
