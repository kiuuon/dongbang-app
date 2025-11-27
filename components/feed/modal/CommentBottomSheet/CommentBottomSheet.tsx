import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';

import { fetchRootComment } from '@/apis/feed/comment';
import COLORS from '@/constants/colors';
import { ERROR_MESSAGE } from '@/constants/error';
import { CommentType } from '@/types/CommentType';
import BoldText from '@/components/common/SemiBoldText';
import CommentCard from './CommentCard';

function CommentBottomSheet({ feedId, isOpen, onClose }: { feedId: string; isOpen: boolean; onClose: () => void }) {
  const bottomSheetModalRef = useRef<BottomSheetModal | null>(null);

  const snapPoints = useMemo(() => ['66%', '90%'], []);

  const [keyboardVisible, setKeyboardVisible] = useState(false);

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
      <BottomSheetFooter {...props}>
        <SafeAreaView edges={['bottom']} style={styles.textInputContainer}>
          <BottomSheetTextInput placeholder="댓글을 입력해주세요." style={styles.textInput} />
        </SafeAreaView>
      </BottomSheetFooter>
    ),
    [],
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
          <BottomSheetFlatList
            data={comments}
            keyExtractor={(item: CommentType) => item.id}
            renderItem={({ item }: { item: CommentType }) => <CommentCard comment={item} />}
            contentContainerStyle={styles.listContainer}
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
    paddingBottom: 450,
  },
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  textInputContainer: {
    backgroundColor: COLORS.white,
    padding: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.gray0,
    borderRadius: 10,
    paddingVertical: 8,
    paddingRight: 40,
    paddingLeft: 16,
  },
});

export default CommentBottomSheet;
