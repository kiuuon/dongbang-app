import { useState } from 'react';
import { Alert, Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { WebView as WebViewType } from 'react-native-webview';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  BottomSheetFlatListMethods,
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';

import { addReplyComment, addRootComment } from '@/apis/feed/comment';
import COLORS from '@/constants/colors';
import { ERROR_MESSAGE } from '@/constants/error';
import useDebounce from '@/hooks/useDebounce';
import commentInputValue from '@/stores/commentInputValueStore';
import RightArrowIcon from '@/icons/RightArrowIcon';
import { fetchUserListByMention } from '@/apis/user';
import RegularText from '@/components/common/RegularText';

function CommentBottomSheetFooter({
  props,
  feedId,
  webViewRef,
  replyTargetIdRef,
  inputRef,
  setReplyTargetId,
  flatListRef,
}: {
  props: BottomSheetFooterProps;
  feedId: string;
  webViewRef: React.RefObject<WebViewType | null>;
  replyTargetIdRef: React.RefObject<string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputRef: React.RefObject<any>;
  setReplyTargetId: React.Dispatch<React.SetStateAction<string>>;
  flatListRef: React.RefObject<BottomSheetFlatListMethods | null>;
}) {
  const queryClient = useQueryClient();
  const inputValue = commentInputValue((state) => state.value);
  const setInputValue = commentInputValue((state) => state.setValue);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [isActive, setIsActive] = useState(false);
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 300);

  const { data: mentionUsers = [] } = useQuery({
    queryKey: ['mentionSearch', debouncedKeyword],
    enabled: isActive && debouncedKeyword.length > 0,
    queryFn: () => fetchUserListByMention(debouncedKeyword),
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.USER.LIST_FETCH_FAILED, error.message);
      return false;
    },
  });

  const { mutate: hanldeAddRootComment } = useMutation({
    mutationFn: () => addRootComment(feedId, inputValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commentCount', feedId] });
      queryClient.invalidateQueries({ queryKey: ['rootCommentList', feedId] });
      setInputValue('');

      const message = {
        type: 'event',
        action: 'write comment',
        payload: feedId,
      };

      webViewRef.current?.postMessage(JSON.stringify(message));

      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: 0, animated: true });
      }, 100);

      inputRef.current?.blur();
    },
    onError: (error) => Alert.alert(ERROR_MESSAGE.COMMENT.WRITE_FAILED, error.message),
  });

  const { mutate: hanldeAddReplyComment } = useMutation({
    mutationFn: () => addReplyComment(feedId, replyTargetIdRef.current, inputValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rootCommentList', feedId] });
      queryClient.invalidateQueries({ queryKey: ['replyCommentList', replyTargetIdRef.current] });
      setReplyTargetId('');
      setInputValue('');

      inputRef.current?.blur();
    },
    onError: (error) => Alert.alert(ERROR_MESSAGE.COMMENT.WRITE_FAILED, error.message),
  });

  const handleInput = (text: string) => {
    const diff = text.length - inputValue.length;
    const cursor = selection.start + diff;

    const before = text.slice(0, cursor);
    const match = before.match(/(?:^|\s)@([\w가-힣]*)$/);

    if (match) {
      setIsActive(true);
      setKeyword(match[1]);
    } else {
      setIsActive(false);
      setKeyword('');
    }

    setInputValue(text);
  };

  const handleSelect = (user: { name: string; nickname: string; avatar: string }) => {
    if (!inputRef.current) return;

    const cursor = selection.start;
    const before = inputValue.slice(0, cursor);
    const after = inputValue.slice(cursor);

    const newBefore = before.replace(
      /(?:^|\s)@[\w가-힣]*$/,
      (match) => `${match.startsWith(' ') ? ' ' : ''}@${user.nickname} `,
    );

    const newValue = newBefore + after;
    setInputValue(newValue);

    const newCursor = newBefore.length;
    setSelection({ start: newCursor, end: newCursor });

    // React Native에서는 setSelection 사용
    setTimeout(() => {
      inputRef.current?.setSelection(newCursor, newCursor);
      inputRef.current?.focus();
    }, 0);

    setKeyword('');
    setIsActive(false);
  };

  return (
    <BottomSheetFooter {...props}>
      <SafeAreaView edges={['bottom']} style={styles.textInputContainer}>
        <BottomSheetTextInput
          ref={inputRef}
          placeholder="댓글을 입력해주세요."
          style={styles.textInput}
          value={inputValue}
          onChangeText={handleInput}
          onSelectionChange={(event) => {
            setSelection({
              start: event.nativeEvent.selection.start,
              end: event.nativeEvent.selection.end,
            });
          }}
          multiline
          scrollEnabled={false}
          textAlignVertical="top"
          placeholderTextColor={COLORS.gray2}
          returnKeyType="send"
          submitBehavior="blurAndSubmit"
          onSubmitEditing={() => {
            if (inputValue.trim() === '') return;
            if (replyTargetIdRef.current === '') {
              hanldeAddRootComment();
            } else {
              hanldeAddReplyComment();
            }
          }}
        />
      </SafeAreaView>
      {isActive && mentionUsers.length > 0 && (
        <View style={styles.mentionUsersContainer}>
          {mentionUsers.map((user) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleSelect(user)}
              style={{ flexDirection: 'row', gap: 12 }}
            >
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
              ) : (
                // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
                <Image source={require('@/assets/images/none_avatar.png')} style={styles.userAvatar} />
              )}
              <View style={{ flexDirection: 'column' }}>
                <RegularText fontSize={14}>{user.name}</RegularText>
                <RegularText fontSize={12} style={{ color: COLORS.gray2 }}>
                  {user.nickname}
                </RegularText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {inputValue.trim() !== '' && (
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => {
            if (inputValue.trim() === '') return;
            if (replyTargetIdRef.current === '') {
              hanldeAddRootComment();
            } else {
              hanldeAddReplyComment();
            }
          }}
        >
          <RightArrowIcon />
        </TouchableOpacity>
      )}
    </BottomSheetFooter>
  );
}

const styles = StyleSheet.create({
  textInputContainer: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderColor: COLORS.gray0,
    padding: 8,
    position: 'relative',
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.gray0,
    borderRadius: 10,
    paddingVertical: 8,
    paddingRight: 40,
    paddingLeft: 16,
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
  },
  sendButton: {
    position: 'absolute',
    right: 16,
    bottom: 49,
  },
  mentionUsersContainer: {
    position: 'absolute',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderColor: COLORS.gray0,
    left: 0,
    right: 0,
    bottom: 88,
    padding: 16,
    flexDirection: 'column',
    gap: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});

export default CommentBottomSheetFooter;
