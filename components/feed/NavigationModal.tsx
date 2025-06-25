import { Modal, View, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import Colors from '@/constants/colors';
import BoldText from '@/components/common/SemiBoldText';

export default function NavigationModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { clubType } = useLocalSearchParams();

  const goToSelectedClubType = (selectedClubType: string) => {
    router.push(`/feed/${selectedClubType}`);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
      <View style={styles.container}>
        <Pressable style={styles.overlay} onPress={onClose} />

        <View style={styles.modal}>
          <View style={{ width: 37, height: 4, backgroundColor: Colors.gray1, marginBottom: 17 }} />
          {clubType !== 'my' && (
            <TouchableOpacity style={styles.modalButton} onPress={() => goToSelectedClubType('my')}>
              <BoldText fontSize={16}>내 동아리</BoldText>
            </TouchableOpacity>
          )}
          {clubType !== 'campus' && (
            <TouchableOpacity style={styles.modalButton} onPress={() => goToSelectedClubType('campus')}>
              <BoldText fontSize={16}>교내 동아리</BoldText>
            </TouchableOpacity>
          )}
          {clubType !== 'union' && (
            <TouchableOpacity style={styles.modalButton} onPress={() => goToSelectedClubType('union')}>
              <BoldText fontSize={16}>연합 동아리</BoldText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.black,
    opacity: 0.6,
  },
  modal: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: Colors.white,
    height: 337,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalButton: {
    width: '100%',
    paddingVertical: 24,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray0,
  },
});
