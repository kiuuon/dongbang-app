/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from 'react';
import { Alert, Image, Modal, StyleSheet, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native';
import { router } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { WebView as WebViewType } from 'react-native-webview';
import { BottomSheetFlatListMethods } from '@gorhom/bottom-sheet';

import { fetchSession } from '@/apis/auth';
import { blockUser, fetchUserId } from '@/apis/user';
import { fetchFeedDetail } from '@/apis/feed/feed';
import { deleteComment, fetchMyCommentLike, toggleCommentLike } from '@/apis/feed/comment';
import COLORS from '@/constants/colors';
import { ERROR_MESSAGE } from '@/constants/error';
import { CommentType } from '@/types/CommentType';
import commentInputValue from '@/stores/commentInputValueStore';
import MoreHorizontalIcon from '@/icons/MoreHorizontalIcon';
import LikesIcon2 from '@/icons/LikesIcon2';
import TrashIcon from '@/icons/TrashIcon';
import ReportIcon2 from '@/icons/ReportIcon2';
import BanIcon2 from '@/icons/BanIcon2';
import BoldText from '@/components/common/SemiBoldText';
import RegularText from '@/components/common/RegularText';
import CustomBottomSheet from '@/components/common/CustomBottomSheet';
import CommentReportBottomsheet from '@/components/report/CommentReportBottomsheet';
import MentionRenderer from './MentionRenderer';

function ReplyCard({
  reply,
  parentId,
  feedId,
  inputRef,

  setReplyTargetId,
  parentIndex,
  index,
  flatListRef,
  webViewRef,
}: {
  reply: CommentType;
  parentId: string;
  feedId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputRef: React.RefObject<any>;
  setReplyTargetId: React.Dispatch<React.SetStateAction<string>>;
  parentIndex: number;
  index: number;
  flatListRef: React.RefObject<BottomSheetFlatListMethods | null>;
  webViewRef: React.RefObject<WebViewType | null>;
}) {
  const queryClient = useQueryClient();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

  const setInputValue = commentInputValue((state) => state.setValue);

  const [isCommentReportBottomSheetOpen, setIsCommentReportBottomSheetOpen] = useState(false);
  const [isCommentReportSuccess, setIsCommentReportSuccess] = useState(false);

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

  const { data: feed } = useQuery({
    queryKey: ['feedDetail', feedId],
    queryFn: () => fetchFeedDetail(feedId),
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.FEED.DELETE_FAILED, error.message);
      return false;
    },
  });

  const { data: isLike } = useQuery({
    queryKey: ['isCommentLike', reply.id],
    queryFn: () => fetchMyCommentLike(reply.id, userId as string),
    enabled: !!userId,
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.LIKE.MY_LIKE_FETCH_FAILED, error.message);
      return false;
    },
  });

  const { mutate: handleDeleteComment } = useMutation({
    mutationFn: () => deleteComment(reply.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commentCount', feedId] });
      queryClient.invalidateQueries({ queryKey: ['rootCommentList', feedId] });
      queryClient.invalidateQueries({ queryKey: ['replyCommentList', parentId] });
      setIsDropdownOpen(false);
    },
    onError: (error) => {
      Alert.alert(ERROR_MESSAGE.COMMENT.DELETE_FAILED, error.message);
    },
  });

  const { mutate: handleToggleCommentLike } = useMutation({
    mutationFn: () => toggleCommentLike(reply.id),
    onMutate: () => {
      queryClient.setQueryData(['replyCommentList', parentId], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) =>
            page.map((item: any) => {
              if (item.id === reply.id) {
                return {
                  ...item,
                  like_count: item.like_count + (!isLike ? 1 : -1),
                };
              }
              return item;
            }),
          ),
        };
      });

      queryClient.setQueryData(['isCommentLike', reply.id], (oldData: any) => !oldData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isCommentLike', reply.id] });
      queryClient.invalidateQueries({ queryKey: ['replyCommentList', parentId] });
    },
    onError: (error) => {
      Alert.alert(ERROR_MESSAGE.LIKE.TOGGLE_FAILED, error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['isCommentLike', reply.id] });
      queryClient.invalidateQueries({ queryKey: ['replyCommentList', parentId] });
    },
  });

  const { mutate: handleBlockUser } = useMutation({
    mutationFn: () => blockUser(reply.author_id),
    onSuccess: () => {
      setIsDropdownOpen(false);
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey[0] === 'rootCommentList',
      });

      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey[0] === 'replyCommentList',
      });
    },
    onError: (error) => Alert.alert(ERROR_MESSAGE.USER.BLOCK_FAILED, error.message),
  });

  const goToProfilePage = () => {
    router.push(`/profile/${reply.author.nickname}`);
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
            {reply.author.avatar ? (
              <Image source={{ uri: reply.author.avatar }} style={styles.memberImage} />
            ) : (
              // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
              <Image source={require('@/assets/images/none_avatar.png')} style={styles.memberImage} />
            )}
          </TouchableOpacity>

          <View style={styles.commentContentContainer}>
            <TouchableOpacity style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }} onPress={goToProfilePage}>
              <BoldText fontSize={16} style={{ height: 19 }}>
                {reply.author.name}
              </BoldText>
              <RegularText fontSize={12} style={{ height: 14, color: COLORS.gray2 }}>
                {getTimeAgo(reply.created_at)}
              </RegularText>
            </TouchableOpacity>

            <RegularText fontSize={14}>
              <MentionRenderer text={reply.content} />
            </RegularText>

            <TouchableOpacity
              onPress={() => {
                setReplyTargetId(reply.parent_id);
                setInputValue(`@${reply.author.nickname} `);
                inputRef.current?.focus();

                // 답글 달기 클릭 시 해당 댓글로 스크롤 (키보드 위에 위치하도록)
                setTimeout(() => {
                  flatListRef.current?.scrollToIndex({
                    index: parentIndex,
                    animated: true,
                    viewPosition: 0.25,
                    viewOffset: -80 * index,
                  });
                }, 100);
              }}
            >
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
              handleToggleCommentLike();
            }}
          >
            <LikesIcon2 isActive={isLike || false} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push(`/feed/detail/${reply.feed_id}/comment/${reply.id}/likes`);
            }}
          >
            <BoldText fontSize={12} style={{ height: 14, color: COLORS.gray2 }}>
              {reply.like_count}
            </BoldText>
          </TouchableOpacity>

          <Modal transparent visible={isDropdownOpen} animationType="fade">
            <TouchableWithoutFeedback onPress={() => setIsDropdownOpen(false)}>
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
            </TouchableWithoutFeedback>

            <View style={[styles.dropdownContainer, { top: dropdownPosition.y + 25, left: dropdownPosition.x - 50 }]}>
              {(feed?.author_id === userId || reply.author_id === userId) && (
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
              {(!session?.user || reply.author_id !== userId) && (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setIsCommentReportBottomSheetOpen(true);
                    setIsCommentReportSuccess(false);
                    setIsDropdownOpen(false);
                  }}
                >
                  <ReportIcon2 />
                  <RegularText fontSize={16} style={{ color: COLORS.error }}>
                    신고
                  </RegularText>
                </TouchableOpacity>
              )}
              {(!session?.user || reply.author_id !== userId) && (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    handleBlockUser();
                  }}
                >
                  <BanIcon2 />
                  <RegularText fontSize={16} style={{ color: COLORS.error }}>
                    차단
                  </RegularText>
                </TouchableOpacity>
              )}
            </View>
          </Modal>
        </View>
      </View>

      <CustomBottomSheet
        isOpen={isCommentReportBottomSheetOpen}
        onClose={() => setIsCommentReportBottomSheetOpen(false)}
        title={isCommentReportSuccess ? '신고가 접수되었습니다' : '신고'}
      >
        <CommentReportBottomsheet
          commentId={reply.id}
          isReportSuccess={isCommentReportSuccess}
          setIsReportSuccess={setIsCommentReportSuccess}
          onClose={() => setIsCommentReportBottomSheetOpen(false)}
          webViewRef={webViewRef}
        />
      </CustomBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  commentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
  // eslint-disable-next-line react-native/no-color-literals
  dropdownContainer: {
    position: 'absolute',
    width: 77,
    right: 0,
    top: 24,
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
});

export default ReplyCard;
