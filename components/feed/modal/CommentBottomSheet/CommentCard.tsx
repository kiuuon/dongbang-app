import { useRef, useState } from 'react';
import { Alert, Image, Modal, StyleSheet, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native';
import { router } from 'expo-router';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchSession } from '@/apis/auth';
import { fetchUserId } from '@/apis/user';
import { fetchFeedDetail } from '@/apis/feed/feed';
import { deleteComment, fetchMyCommentLike, fetchReplyComment, toggleCommentLike } from '@/apis/feed/comment';
import COLORS from '@/constants/colors';
import { ERROR_MESSAGE } from '@/constants/error';
import { CommentType } from '@/types/CommentType';
import MoreHorizontalIcon from '@/icons/MoreHorizontalIcon';
import LikesIcon2 from '@/icons/LikesIcon2';
import TrashIcon from '@/icons/TrashIcon';
import ReportIcon2 from '@/icons/ReportIcon2';
import BoldText from '@/components/common/SemiBoldText';
import RegularText from '@/components/common/RegularText';
import ReplyCard from './ReplyCard';

function CommentCard({ comment }: { comment: CommentType }) {
  const queryClient = useQueryClient();

  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

  const moreButtonRef = useRef<View>(null);

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.SESSION.FETCH_FAILED, error.message);
      return false;
    },
  });

  const { data: userId } = useQuery({
    queryKey: ['userId'],
    queryFn: fetchUserId,
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.USER.ID_FETCH_FAILED, error.message);
      return false;
    },
  });

  const { data: isLike } = useQuery({
    queryKey: ['isCommentLike', comment.id],
    queryFn: () => fetchMyCommentLike(comment.id),
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.LIKE.MY_LIKE_FETCH_FAILED, error.message);
      return false;
    },
  });

  const { data: feed } = useQuery({
    queryKey: ['feedDetail', comment.feed_id],
    queryFn: () => fetchFeedDetail(comment.feed_id as string),
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.FEED.DELETE_FAILED, error.message);
      return false;
    },
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['replyCommentList', comment.id],
    queryFn: ({ pageParam }) => fetchReplyComment(comment.feed_id, comment.id, pageParam),
    getNextPageParam: (lastPage, allPages) => (lastPage?.length === 5 ? allPages.length : undefined),
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.COMMENT.LIST_FETCH_FAILED, error.message);
      return false;
    },
  });

  const { mutate: handleDeleteComment } = useMutation({
    mutationFn: () => deleteComment(comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commentCount', comment.feed_id] });
      queryClient.invalidateQueries({ queryKey: ['rootCommentList', comment.feed_id] });
    },
    onError: (error) => {
      Alert.alert(ERROR_MESSAGE.COMMENT.DELETE_FAILED, error.message);
    },
  });

  const { mutate: handleToggleFeedLike } = useMutation({
    mutationFn: () => toggleCommentLike(comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isCommentLike', comment.id] });
      queryClient.invalidateQueries({ queryKey: ['rootCommentList', comment.feed_id] });
    },
    onError: (error) => {
      Alert.alert(ERROR_MESSAGE.LIKE.TOGGLE_FAILED, error.message);
    },
  });

  const goToProfilePage = () => {
    router.push(`/profile/${comment.author.nickname}`);
  };

  function getTimeAgo(dateString: string) {
    const now = new Date();
    const created = new Date(dateString);

    const diff = (now.getTime() - created.getTime()) / 1000;

    const minutes = diff / 60;
    const hours = diff / 3600;
    const days = diff / 86400;
    const months = diff / (86400 * 30);
    const years = diff / (86400 * 365);

    if (years >= 1) return `${Math.floor(years)}년 전`;
    if (months >= 1) return `${Math.floor(months)}개월 전`;
    if (days >= 1) return `${Math.floor(days)}일 전`;
    if (hours >= 1) return `${Math.floor(hours)}시간 전`;
    if (minutes >= 1) return `${Math.floor(minutes)}분 전`;
    return '방금 전';
  }

  return (
    <View style={styles.container}>
      <View style={styles.commentContainer}>
        <View style={styles.commentInfoContainer}>
          <TouchableOpacity onPress={goToProfilePage}>
            {comment.author.avatar ? (
              <Image source={{ uri: comment.author.avatar }} style={styles.memberImage} />
            ) : (
              // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
              <Image source={require('@/assets/images/none_avatar.png')} style={styles.memberImage} />
            )}
          </TouchableOpacity>

          <View style={styles.commentContentContainer}>
            <TouchableOpacity style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }} onPress={goToProfilePage}>
              <BoldText fontSize={16} style={{ height: 19 }}>
                {comment.author.name}
              </BoldText>
              <RegularText fontSize={12} style={{ height: 14, color: COLORS.gray2 }}>
                {getTimeAgo(comment.created_at)}
              </RegularText>
            </TouchableOpacity>

            <RegularText fontSize={14}>{comment.content}</RegularText>

            <TouchableOpacity>
              <RegularText fontSize={12} style={{ marginTop: 2, color: COLORS.gray3 }}>
                답글 달기
              </RegularText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.commentButtonsContainer}>
          <TouchableOpacity
            ref={moreButtonRef}
            onPress={() => {
              moreButtonRef.current?.measureInWindow((x, y) => {
                setDropdownPosition({ x, y });
              });
              setIsDropdownOpen((prev) => !prev);
            }}
          >
            <MoreHorizontalIcon />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleToggleFeedLike();
            }}
          >
            <LikesIcon2 isActive={isLike || false} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push(`/feed/detail/${comment.feed_id}/comment/${comment.id}/likes`);
            }}
          >
            <BoldText fontSize={12} style={{ height: 14, color: COLORS.gray2 }}>
              {comment.like_count}
            </BoldText>
          </TouchableOpacity>

          <Modal transparent visible={isDropdownOpen} animationType="fade">
            <TouchableWithoutFeedback onPress={() => setIsDropdownOpen(false)}>
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
            </TouchableWithoutFeedback>

            <View style={[styles.dropdownContainer, { top: dropdownPosition.y + 25, left: dropdownPosition.x - 50 }]}>
              {(feed?.author_id === userId || comment.author_id === userId) && (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    handleDeleteComment();
                  }}
                >
                  <TrashIcon />
                  <RegularText fontSize={16} style={{ color: COLORS.gray3 }}>
                    삭제
                  </RegularText>
                </TouchableOpacity>
              )}
              {(!session?.user || comment.author_id !== userId) && (
                <TouchableOpacity style={styles.dropdownItem}>
                  <ReportIcon2 />
                  <RegularText fontSize={16} style={{ color: COLORS.error }}>
                    신고
                  </RegularText>
                </TouchableOpacity>
              )}
            </View>
          </Modal>
        </View>
      </View>

      {comment.reply_count > 0 && (
        <View style={styles.replyContainer}>
          <TouchableOpacity style={styles.replyButton} onPress={() => setIsReplyOpen((prev) => !prev)}>
            <View style={styles.replySeparator} />
            <RegularText fontSize={12} style={{ color: COLORS.gray3 }}>
              답글 {comment.reply_count}개
            </RegularText>
          </TouchableOpacity>

          {isReplyOpen && (
            <View style={styles.replyCardContainer}>
              {data?.pages.map((page) =>
                page.map((rp) => <ReplyCard key={rp.id} reply={rp} parentId={comment.id} feedId={comment.feed_id} />),
              )}
            </View>
          )}

          {isReplyOpen && hasNextPage && (
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
              onPress={() => {
                fetchNextPage();
              }}
              disabled={isFetchingNextPage}
            >
              <View style={styles.replySeparator} />
              <RegularText fontSize={12} style={{ color: COLORS.gray3 }}>
                답글 더보기
              </RegularText>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  commentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  commentInfoContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    flexShrink: 1,
  },
  memberImage: {
    width: 32,
    height: 32,
    borderRadius: '100%',
  },
  commentContentContainer: {
    flexDirection: 'column',
    gap: 6,
    flexShrink: 1,
  },
  commentButtonsContainer: {
    position: 'relative',
    marginLeft: 8,
    flexDirection: 'column',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  // eslint-disable-next-line react-native/no-color-literals
  dropdownContainer: {
    position: 'absolute',
    width: 77,
    zIndex: 10,
    flexDirection: 'column',
    gap: 11,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    padding: 10,
    // iOS shadow
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    // Android shadow
    elevation: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  replyContainer: {
    flexDirection: 'column',
    marginBottom: 16,
    paddingLeft: 44,
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  replySeparator: {
    width: 21,
    height: 1,
    backgroundColor: COLORS.gray3,
  },
  replyCardContainer: {
    marginTop: 20,
  },
});

export default CommentCard;
