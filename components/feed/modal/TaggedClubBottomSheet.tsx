import { router } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { fetchFeedDetail } from '@/apis/feed/feed';
import COLORS from '@/constants/colors';
import { ERROR_MESSAGE } from '@/constants/error';
import BoldText from '@/components/common/SemiBoldText';

function TaggedClubBottomSheet({
  feedId,
  taggedClubs,
  onClose,
  currentPath,
}: {
  feedId: string;
  taggedClubs: { club: { id: string; name: string; logo: string } }[];
  onClose: () => void;
  currentPath: '' | '/my' | '/feed' | '/explore' | '/interact' | '/club' | '/feed/detail';
}) {
  const { data: feed } = useQuery({
    queryKey: ['feedDetail', feedId],
    queryFn: () => fetchFeedDetail(feedId as string),
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.FEED.DETAIL_FETCH_FAILED, error.message);
      return false;
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        key={feed?.club.logo}
        style={styles.button}
        onPress={() => {
          onClose();
          if (currentPath === '/feed/detail') {
            router.push(`/club/detail/${feed?.club_id}`);
          } else {
            router.push(`${currentPath}/club/${feed?.club_id}`);
          }
        }}
      >
        <Image source={{ uri: feed?.club.logo }} style={styles.clubImage} />
        <BoldText fontSize={12}>{feed?.club.name}</BoldText>
      </TouchableOpacity>
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
