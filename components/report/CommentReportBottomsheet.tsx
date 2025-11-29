import { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { WebView as WebViewType } from 'react-native-webview';

import { report } from '@/apis/report';
import { fetchCommentDetail } from '@/apis/feed/comment';
import { ERROR_MESSAGE } from '@/constants/error';
import COLORS from '@/constants/colors';
import RegularText from '../common/RegularText';
import BoldText from '../common/SemiBoldText';
import UserBlockBottomsheet from './UserBlockBottomsheet';

const REPORT_ITEMS = {
  abuse: '욕설/비하 발언입니다',
  spam: '스팸/광고성 댓글입니다',
  illegal: '불법/위험 내용을 포함합니다',
  inappropriate: '부적절한(혐오/선정/폭력) 댓글입니다',
};

function CommentReportBottomsheet({
  commentId,
  isReportSuccess,
  setIsReportSuccess,
  onClose,
  webViewRef,
}: {
  commentId: string;
  isReportSuccess: boolean;
  setIsReportSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  webViewRef: React.RefObject<WebViewType | null>;
}) {
  const [selectedReportItem, setSelectedReportItem] = useState<keyof typeof REPORT_ITEMS | null>(null);

  const { data: comment } = useQuery({
    queryKey: ['commentDetail', commentId],
    queryFn: () => fetchCommentDetail(commentId),
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.COMMENT.DETAIL_FETCH_FAILED, error.message);
      return false;
    },
  });

  const { mutate: handleReport } = useMutation({
    mutationFn: () => report('comment', commentId, REPORT_ITEMS[selectedReportItem as keyof typeof REPORT_ITEMS]),
    onSuccess: () => {
      setIsReportSuccess(true);
    },
    onError: (error) => Alert.alert(ERROR_MESSAGE.REPORT.REPORT_FAILED, error.message),
  });

  const handleReportButtonClick = () => {
    if (!selectedReportItem) {
      return;
    }
    handleReport();
  };

  if (isReportSuccess) {
    return (
      <UserBlockBottomsheet
        commentId={commentId}
        userInfo={{
          userId: comment?.author.id,
          username: comment?.author.name,
          nickname: comment?.author.nickname,
        }}
        onClose={onClose}
        webViewRef={webViewRef}
      />
    );
  }

  return (
    <View style={styles.container}>
      <RegularText fontSize={12} style={{ color: COLORS.gray1 }}>
        이 댓글을 신고하는 이유를 알려주세요. 신고 내용은 동방 운영팀이 검토하며 , 익명으로 처리됩니다.
      </RegularText>
      <View style={styles.buttonContainer}>
        {Object.entries(REPORT_ITEMS).map(([key, value]) => (
          <TouchableOpacity
            key={key}
            style={[styles.button, selectedReportItem === key && styles.selectedButton]}
            onPress={() => setSelectedReportItem(key as keyof typeof REPORT_ITEMS)}
          >
            <RegularText fontSize={12}>{value}</RegularText>
            <View style={[styles.checkIcon, selectedReportItem === key && styles.selectedCheckIcon]} />
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.submitButton, selectedReportItem && styles.submitButtonActive]}
        onPress={handleReportButtonClick}
      >
        <BoldText fontSize={12} style={{ color: COLORS.white }}>
          신고
        </BoldText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 8,
    marginTop: 18,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingLeft: 24,
    paddingRight: 17,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray0,
  },
  selectedButton: {
    backgroundColor: COLORS.background,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: '100%',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray0,
  },
  selectedCheckIcon: {
    backgroundColor: COLORS.black,
    borderColor: COLORS.black,
  },
  submitButton: {
    marginTop: 12,
    marginBottom: 20,
    paddingVertical: 21,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gray0,
  },
  submitButtonActive: {
    backgroundColor: COLORS.error,
  },
});

export default CommentReportBottomsheet;
