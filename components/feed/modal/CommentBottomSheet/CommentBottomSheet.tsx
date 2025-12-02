import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, StyleSheet, View } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
} from '@gorhom/bottom-sheet';
import type { WebView as WebViewType } from 'react-native-webview';

import { fetchRootComment } from '@/apis/feed/comment';
import COLORS from '@/constants/colors';
import { ERROR_MESSAGE } from '@/constants/error';
import { CommentType } from '@/types/CommentType';
import BoldText from '@/components/common/SemiBoldText';
import RegularText from '@/components/common/RegularText';
import CommentCard from './CommentCard';
import CommentBottomSheetFooter from './CommentBottomSheetFooter';

function CommentBottomSheet({
  feedId,
  isOpen,
  onClose,
  webViewRef,
}: {
  feedId: string;
  isOpen: boolean;
  onClose: () => void;
  webViewRef: React.RefObject<WebViewType | null>;
}) {
  const bottomSheetModalRef = useRef<BottomSheetModal | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inputRef = useRef<any>(null);
  const flatListRef = useRef<BottomSheetFlatListMethods | null>(null);

  const snapPoints = useMemo(() => ['66%', '90%'], []);

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [replyTargetId, setReplyTargetId] = useState('');
  const replyTargetIdRef = useRef('');

  useEffect(() => {
    replyTargetIdRef.current = replyTargetId;
  }, [replyTargetId]);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isOpen, bottomSheetModalRef]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    initialPageParam: 0,
    enabled: !!feedId,
    queryKey: ['rootCommentList', feedId],
    queryFn: ({ pageParam }) => fetchRootComment(feedId, pageParam),
    getNextPageParam: (lastPage, allPages) => (lastPage?.length === 20 ? allPages.length : undefined),
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.COMMENT.LIST_FETCH_FAILED, error.message);
      return false;
    },
  });

  const comments = data?.pages.flat() ?? [];

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} pressBehavior="close" />
    ),
    [],
  );

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <CommentBottomSheetFooter
        props={props}
        feedId={feedId}
        webViewRef={webViewRef}
        replyTargetIdRef={replyTargetIdRef}
        inputRef={inputRef}
        setReplyTargetId={setReplyTargetId}
        flatListRef={flatListRef}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [feedId, webViewRef],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      keyboardBehavior="extend"
      enableDynamicSizing={false}
      onDismiss={onClose}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      backdropComponent={renderBackdrop}
      footerComponent={renderFooter}
    >
      <View>
        <BoldText fontSize={14} style={{ marginBottom: 32, width: '100%', textAlign: 'center' }}>
          댓글
        </BoldText>
        <View
          style={{
            height: keyboardVisible ? '80%' : '100%',
          }}
        >
          {comments.length > 0 ? (
            <BottomSheetFlatList
              ref={flatListRef}
              data={comments}
              keyExtractor={(item: CommentType) => item.id}
              renderItem={({ item, index }: { item: CommentType; index: number }) => (
                <CommentCard
                  comment={item}
                  replyTargetId={replyTargetId}
                  setReplyTargetId={setReplyTargetId}
                  inputRef={inputRef}
                  index={index}
                  flatListRef={flatListRef}
                  webViewRef={webViewRef}
                />
              )}
              contentContainerStyle={[styles.listContainer, { paddingBottom: keyboardVisible ? 30 : 200 }]}
              showsVerticalScrollIndicator={false}
              onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) {
                  fetchNextPage();
                }
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                isFetchingNextPage ? (
                  <View style={styles.loaderContainer}>
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  </View>
                ) : null
              }
              bounces={false}
              overScrollMode="never"
              nestedScrollEnabled
            />
          ) : (
            <View style={styles.emptyContainer}>
              <BoldText fontSize={24}>아직 등록된 댓글이 없어요</BoldText>
              <RegularText fontSize={20} style={{ color: COLORS.gray3 }}>
                첫 댓글을 남겨보세요
              </RegularText>
            </View>
          )}
        </View>
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: COLORS.white,
  },
  handleIndicator: {
    backgroundColor: COLORS.gray1,
    width: 37,
    height: 2,
    alignSelf: 'center',
    marginVertical: 6,
  },
  listContainer: {
    paddingHorizontal: 24,
  },
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flexDirection: 'column',
    gap: 16,
    marginTop: 100,
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default CommentBottomSheet;
