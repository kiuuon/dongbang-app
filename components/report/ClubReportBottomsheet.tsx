import { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { report } from '@/apis/report';
import { ERROR_MESSAGE } from '@/constants/error';
import COLORS from '@/constants/colors';
import RegularText from '../common/RegularText';
import BoldText from '../common/SemiBoldText';

const REPORT_ITEMS = {
  falseInformation: '동아리 소개 내용이 사실과 다릅니다',
  illegal: '불법/위험 활동이 의심됩니다',
  discrimination: '특정 인물/집단에 대한 혐오/차별을 조장합니다',
};

function ClubReportBottomsheet({ clubId, onClose }: { clubId: string; onClose: () => void }) {
  const [selectedReportItem, setSelectedReportItem] = useState<keyof typeof REPORT_ITEMS | null>(null);

  const { mutate: handleReport } = useMutation({
    mutationFn: () => report('club', clubId, REPORT_ITEMS[selectedReportItem as keyof typeof REPORT_ITEMS]),
    onSuccess: () => {
      Toast.show({
        text1: '신고가 접수되었습니다',
        type: 'success',
      });
      onClose();
    },
    onError: (error) => Alert.alert(ERROR_MESSAGE.REPORT.REPORT_FAILED, error.message),
  });

  const handleReportButtonClick = () => {
    if (!selectedReportItem) {
      return;
    }
    handleReport();
  };

  return (
    <View style={styles.container}>
      <RegularText fontSize={12} style={{ color: COLORS.gray1 }}>
        이 동아리를 신고하는 이유를 알려주세요. 신고 내용은 동방 운영팀이 검토하며 , 익명으로 처리됩니다.
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
        <View style={styles.emptyButton} />
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
  emptyButton: {
    height: 56,
    width: '100%',
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

export default ClubReportBottomsheet;
