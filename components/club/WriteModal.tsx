import { View, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { fetchMyRole } from '@/apis/club';
import COLORS from '@/constants/colors';
import { ERROR_MESSAGE } from '@/constants/error';
import FeedIcon from '@/icons/FeedIcon';
import PersonIcon from '@/icons/PersonIcon';
import TagIcon from '@/icons/TagIcon';
import EditIcon2 from '@/icons/EditIcon2';
import RegularText from '../common/RegularText';

interface WriteModalProps {
  visible: boolean;
  onClose: () => void;
  clubId: string;
}

export default function WriteModal({ visible, onClose, clubId }: WriteModalProps) {
  const { data: myRole } = useQuery({
    queryKey: ['myRole', clubId],
    queryFn: () => fetchMyRole(clubId as string),
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.USER.ROLE_FETCH_FAILED, error.message);
      return false;
    },
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.container}>
          {/* 회장, 임원 */}
          {(myRole === 'president' || myRole === 'officer') && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  router.push(`/club/detail/${clubId}/members/manage`);
                  onClose();
                }}
              >
                <PersonIcon />
                <RegularText fontSize={16}>부원 관리</RegularText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  router.push(`/club/edit/${clubId}/info`);
                  onClose();
                }}
              >
                <EditIcon2 color="#F9A825" />
                <RegularText fontSize={16}>동아리 정보 수정</RegularText>
              </TouchableOpacity>
            </View>
          )}
          {/* 전체 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                router.push(`/club/detail/${clubId}/profile`);
                onClose();
              }}
            >
              <TagIcon />
              <RegularText fontSize={16}>활동명 변경</RegularText>
            </TouchableOpacity>
            {(myRole === 'president' || myRole === 'officer' || myRole === 'member') && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  router.push(`/feed/write/${clubId}`);
                  onClose();
                }}
              >
                <FeedIcon />
                <RegularText fontSize={16}>피드 작성</RegularText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.modalBackdrop,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  container: {
    flexDirection: 'column',
    gap: 12,
    marginRight: 20,
    marginBottom: 220,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 12,
    width: 180,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    opacity: 1,
    paddingLeft: 13,
    paddingVertical: 16,
  },
  button: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
});
