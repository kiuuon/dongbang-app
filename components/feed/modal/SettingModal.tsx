import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { WebView as WebViewType } from 'react-native-webview';

import { deleteFeed } from '@/apis/feed/feed';
import { fetchUserId } from '@/apis/user';
import COLORS from '@/constants/colors';
import EditIcon from '@/icons/EditIcon';
import DeleteIcon from '@/icons/DeleteIcon';
import ShareIcon from '@/icons/ShareIcon';
import HideIcon from '@/icons/HideIcon';
import ReportIcon from '@/icons/ReportIcon';
import BoldText from '@/components/common/SemiBoldText';

function SettingModal({
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
      Alert.alert('사용자 ID를 불러오는 데 실패했습니다. 다시 시도해주세요.', error.message);
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
      Alert.alert('피드 삭제에 실패했습니다. 다시 시도해주세요.', error.message);
    },
  });

  const clickDeleteButton = () => {
    handleDeleteFeed();
  };

  return (
    <View style={styles.container}>
      {authorId === userId ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.bottomBorder]}>
            <EditIcon />
            <BoldText fontSize={16}>수정</BoldText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.bottomBorder]} onPress={clickDeleteButton}>
            <DeleteIcon />
            <BoldText fontSize={16}>삭제</BoldText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <ShareIcon />
            <BoldText fontSize={16}>공유</BoldText>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.bottomBorder]}>
            <ShareIcon />
            <BoldText fontSize={16}>공유</BoldText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.bottomBorder]}>
            <HideIcon />
            <BoldText fontSize={16}>이 글 숨기기</BoldText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
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

export default SettingModal;
