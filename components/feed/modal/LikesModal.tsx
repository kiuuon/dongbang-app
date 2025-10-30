import { View, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { fetchFeedLikedUsers } from '@/apis/feed/like';
import COLORS from '@/constants/colors';
import { ERROR_MESSAGE } from '@/constants/error';
import BoldText from '@/components/common/SemiBoldText';

function LikesModal({ feedId }: { feedId: string }) {
  const { data: feedLikedUsers } = useQuery({
    queryKey: ['feedLikedUsers', feedId],
    queryFn: () => fetchFeedLikedUsers(feedId),
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.LIKE.USERS_FETCH_FAILED, error.message);
      return false;
    },
  });

  return (
    <View style={styles.container}>
      {feedLikedUsers?.map((user) => (
        <TouchableOpacity key={user.name} style={styles.button}>
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
    marginBottom: 60,
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

export default LikesModal;
