import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { fetchUserId } from '@/apis/user';
import Colors from '@/constants/colors';
import EditIcon from '@/icons/EditIcon';
import DeleteIcon from '@/icons/DeleteIcon';
import ShareIcon from '@/icons/ShareIcon';
import HideIcon from '@/icons/HideIcon';
import ReportIcon from '@/icons/ReportIcon';
import BoldText from '@/components/common/SemiBoldText';

function SettingModal({ authorId }: { authorId: string }) {
  const { data: userId } = useQuery({
    queryKey: ['userId'],
    queryFn: fetchUserId,
    throwOnError: (error) => {
      Alert.alert('사용자 ID를 불러오는 데 실패했습니다. 다시 시도해주세요.', error.message);
      return false;
    },
  });

  return (
    <View style={styles.container}>
      {authorId === userId ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.bottomBorder]}>
            <EditIcon />
            <BoldText fontSize={16}>수정</BoldText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.bottomBorder]}>
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
    backgroundColor: Colors.background,
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
    borderBottomColor: Colors.gray0,
  },
});

export default SettingModal;
