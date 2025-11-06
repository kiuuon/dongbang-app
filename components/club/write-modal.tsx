import { View, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { router } from 'expo-router';

import COLORS from '@/constants/colors';
import FeedIcon from '@/icons/FeedIcon';
import PersonIcon from '@/icons/PersonIcon';
import EditIcon2 from '@/icons/EditIcon2';
import RegularText from '../common/RegularText';

interface WriteModalProps {
  visible: boolean;
  onClose: () => void;
  clubId: string;
}

export default function WriteModal({ visible, onClose, clubId }: WriteModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                router.push(`/club/${clubId}/members/manage`);
                onClose();
              }}
            >
              <PersonIcon />
              <RegularText fontSize={16}>부원 관리</RegularText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <EditIcon2 color="#F9A825" />
              <RegularText fontSize={16}>동아리 소개 수정</RegularText>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
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
