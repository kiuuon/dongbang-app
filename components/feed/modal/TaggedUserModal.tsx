import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';

import COLORS from '@/constants/colors';
import BoldText from '@/components/common/SemiBoldText';

function TaggedUserModal({ taggedUsers }: { taggedUsers: { user: { name: string; avatar: string } }[] }) {
  return (
    <View style={styles.container}>
      {taggedUsers.map(({ user }) => (
        <TouchableOpacity key={user.name} style={styles.button}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.userImage} />
          ) : (
            <View style={styles.noneImage} />
          )}
          <BoldText fontSize={12}>{user.name}</BoldText>
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
  userImage: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.background,
    borderRadius: 25,
  },
  noneImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: COLORS.black,
  },
});

export default TaggedUserModal;
