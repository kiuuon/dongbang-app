import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';

import COLORS from '@/constants/colors';
import BoldText from '@/components/common/SemiBoldText';

function TaggedUserBottomSheet({
  taggedUsers,
  onClose,
  currentPath,
}: {
  taggedUsers: { user: { id: string; name: string; avatar: string; nickname: string } }[];
  onClose: () => void;
  currentPath: '' | '/my' | '/feed' | '/explore' | '/interact' | '/club' | '/feed/detail';
}) {
  return (
    <View style={styles.container}>
      {taggedUsers.map(({ user }) => (
        <TouchableOpacity
          key={user.name}
          style={styles.button}
          onPress={() => {
            onClose();
            router.push(`${currentPath}/profile/${user.nickname}`);
          }}
        >
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.userImage} />
          ) : (
            // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
            <Image source={require('@/assets/images/none_avatar.png')} style={styles.userImage} />
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
});

export default TaggedUserBottomSheet;
