import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { WebView as WebViewType } from 'react-native-webview';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';

import { deleteFeed } from '@/apis/feed/feed';
import { blockUser, fetchUserId } from '@/apis/user';
import COLORS from '@/constants/colors';
import { ERROR_MESSAGE } from '@/constants/error';
import EditIcon from '@/icons/EditIcon';
import DeleteIcon from '@/icons/DeleteIcon';
import ShareIcon from '@/icons/ShareIcon';
import BanIcon from '@/icons/BanIcon';
import ReportIcon from '@/icons/ReportIcon';
import BoldText from '@/components/common/SemiBoldText';

function SettingBottomSheet({
  authorId,
  feedId,
  onClose,
  isFeedDetail,
  webViewRef,
}: {
  authorId: string;
  feedId: string;
  onClose: () => void;
  isFeedDetail: boolean;
  webViewRef: React.RefObject<WebViewType | null>;
}) {
  const queryClient = useQueryClient();

  const { data: userId } = useQuery({
    queryKey: ['userId'],
    queryFn: fetchUserId,
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.USER.ID_FETCH_FAILED, error.message);
      return false;
    },
  });

  const { mutate: handleDeleteFeed } = useMutation({
    mutationFn: () => deleteFeed(feedId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'feeds',
      });

      onClose();

      const message = {
        type: 'event',
        action: 'delete feed',
      };

      webViewRef.current?.postMessage(JSON.stringify(message));

      if (isFeedDetail) router.back();
    },
    onError: (error) => {
      Alert.alert(ERROR_MESSAGE.FEED.DELETE_FAILED, error.message);
    },
  });

  const { mutate: handleBlockUser } = useMutation({
    mutationFn: () => blockUser(authorId),
    onSuccess: () => {
      onClose();

      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'feeds',
      });

      const message = {
        type: 'event',
        action: 'block user in Feed',
        payload: feedId,
      };

      webViewRef.current?.postMessage(JSON.stringify(message));
    },
    onError: (error) => Alert.alert(ERROR_MESSAGE.USER.BLOCK_FAILED, error.message),
  });

  const clickEditButton = () => {
    router.push(`/feed/edit/${feedId}`);
    onClose();
  };

  const clickDeleteButton = () => {
    handleDeleteFeed();
  };

  const clickShareButton = async () => {
    try {
      const url = `${process.env.EXPO_PUBLIC_WEB_URL}/feed/detail/${feedId}`;
      await Clipboard.setStringAsync(url);
      Toast.show({
        type: 'success',
        text1: '복사 완료!',
        text2: '피드 링크가 클립보드에 복사되었습니다!',
      });
      onClose();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      Toast.show({
        type: 'error',
        text1: '복사 실패!',
        text2: '피드 링크 복사에 실패했습니다. 다시 시도해주세요.',
      });
    }
  };

  return (
    <View style={styles.container}>
      {authorId === userId ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.bottomBorder]} onPress={clickEditButton}>
            <EditIcon />
            <BoldText fontSize={16}>수정</BoldText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.bottomBorder]} onPress={clickDeleteButton}>
            <DeleteIcon />
            <BoldText fontSize={16}>삭제</BoldText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={clickShareButton}>
            <ShareIcon />
            <BoldText fontSize={16}>공유</BoldText>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={clickShareButton}>
            <ShareIcon />
            <BoldText fontSize={16}>공유</BoldText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.bottomBorder]}
            onPress={() => {
              handleBlockUser();
            }}
          >
            <BanIcon />
            <BoldText fontSize={16}>차단</BoldText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.bottomBorder]}>
            <ReportIcon />
            <BoldText fontSize={16}>신고</BoldText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 10, paddingHorizontal: 20 },
  buttonContainer: {
    flexDirection: 'column',
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  button: {
    paddingLeft: 48,
    paddingVertical: 21,
    flexDirection: 'row',
    gap: 30,
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray0,
  },
});

export default SettingBottomSheet;
