import { View, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { fetchFeedLikeCount } from '@/apis/feed/like';
import formatKoreanDate from '@/utils/formatKoreanDate';
import COLORS from '@/constants/colors';
import { ERROR_MESSAGE } from '@/constants/error';
import { FeedType } from '@/types/FeedType';
import LikesIcon from '@/icons/LikesIcon';
import RegularText from '@/components/common/RegularText';
import BoldText from '@/components/common/SemiBoldText';

function FeedCard({ feed }: { feed: FeedType }) {
  const handlePress = () => {
    router.push(`/feed/detail/${feed.id}`);
  };

  const { data: likeCount } = useQuery({
    queryKey: ['likeCount', feed.id],
    queryFn: () => fetchFeedLikeCount(feed.id),
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.LIKE.COUNT_FETCH_FAILED, (error as Error).message);
      return false;
    },
  });

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={handlePress}>
      {/* 상단 클럽 로고 + 이름 */}
      <View style={styles.clubRow}>
        <Image source={{ uri: feed.club.logo }} style={styles.clubLogo} />
        <RegularText fontSize={12}>{feed.club.name}</RegularText>
      </View>

      {/* 피드 이미지 */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: feed.photos[0] }} style={styles.feedImage} resizeMode="cover" />
      </View>

      {/* 피드 정보 */}
      <View style={styles.infoContainer}>
        {(feed.title || feed.content) && (
          <View style={{ paddingRight: 20 }}>
            <BoldText fontSize={14} numberOfLines={1}>
              {feed.title ? feed.title : feed.content}
            </BoldText>
          </View>
        )}
        <View style={styles.bottomRow}>
          <RegularText fontSize={12}>{formatKoreanDate(feed.created_at)}</RegularText>
          <View style={styles.likeRow}>
            <LikesIcon />
            <RegularText fontSize={12}>{likeCount}</RegularText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default FeedCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '49%',
  },
  clubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clubLogo: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.background,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 170 / 227,
    marginVertical: 4,
  },
  feedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.background,
  },
  infoContainer: {
    width: '100%',
    gap: 3,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 4,
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
