import { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { WebView as WebViewType } from 'react-native-webview';

import { report } from '@/apis/report';
import { fetchFeedDetail } from '@/apis/feed/feed';
import { ERROR_MESSAGE } from '@/constants/error';
import COLORS from '@/constants/colors';
import RegularText from '../common/RegularText';
import BoldText from '../common/SemiBoldText';
import UserBlockBottomsheet from './UserBlockBottomsheet';

const REPORT_ITEMS = {
  spam: '스팸/광고성 게시글입니다',
  illegal: '불법/유해한 내용을 올리는 게시글입니다',
  falseInformation: '거짓 정보 혹은 허위 사실글입니다',
  inappropriate: '부적절한(혐오/선정/폭력) 게시글입니다',
};

function FeedReportBottomsheet({
  feedId,
  isReportSuccess,
  setIsReportSuccess,
  onClose,
  webViewRef,
}: {
  feedId: string;
  isReportSuccess: boolean;
  setIsReportSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  webViewRef: React.RefObject<WebViewType | null>;
}) {
  const [selectedReportItem, setSelectedReportItem] = useState<keyof typeof REPORT_ITEMS | null>(null);

  const { data: feed } = useQuery({
    queryKey: ['feedDetail', feedId],
    queryFn: () => fetchFeedDetail(feedId),
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.FEED.DELETE_FAILED, error.message);
      return false;
    },
  });

  const { mutate: handleReport } = useMutation({
    mutationFn: () => report('feed', feedId, REPORT_ITEMS[selectedReportItem as keyof typeof REPORT_ITEMS]),
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
        feedId={feedId}
        userInfo={{
          userId: feed?.author.id,
          username: feed?.author.name,
          nickname: feed?.author.nickname,
        }}
        onClose={onClose}
        webViewRef={webViewRef}
      />
    );
  }

  return (
    <View style={styles.container}>
      <RegularText fontSize={12} style={{ color: COLORS.gray1 }}>
        이 피드를 신고하는 이유를 알려주세요. 신고 내용은 동방 운영팀이 검토하며 , 익명으로 처리됩니다.
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

export default FeedReportBottomsheet;
