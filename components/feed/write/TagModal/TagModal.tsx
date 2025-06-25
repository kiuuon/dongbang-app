import { useState } from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native';

import Colors from '@/constants/colors';
import BoldText from '@/components/common/SemiBoldText';
import RegularText from '@/components/common/RegularText';
import ClubTagModal from './ClubTagModal';
import PersonTagModal from './PersonTagModal';

function TagModal({
  visible,
  onClose,
  selectedMembers,
  setSelectedMembers,
  selectedClubs,
  setSelectedClubs,
}: {
  visible: boolean;
  onClose: () => void;
  selectedMembers: string[];
  setSelectedMembers: React.Dispatch<React.SetStateAction<string[]>>;
  selectedClubs: string[];
  setSelectedClubs: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [isClub, setIsClub] = useState(false);
  const [draftSelectedMembers, setDraftSelectedMembers] = useState<string[]>(selectedMembers);
  const [draftSelectedClubs, setDraftSelectedClubs] = useState<string[]>(selectedClubs);

  const handleConfirm = () => {
    setSelectedMembers(draftSelectedMembers);
    setSelectedClubs(draftSelectedClubs);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'height' : 'height'} style={styles.container}>
        <Pressable style={styles.overlay} onPress={onClose} />
        <View style={styles.modal}>
          <View style={styles.toggleButtonContainer}>
            {isClub ? (
              <TouchableOpacity style={styles.inactiveToggleButton} onPress={() => setIsClub(false)}>
                <RegularText fontSize={16}>개인</RegularText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.activeToggleButton} onPress={() => setIsClub(false)}>
                <BoldText fontSize={16} style={{ color: Colors.white }}>
                  개인
                </BoldText>
              </TouchableOpacity>
            )}
            {isClub ? (
              <TouchableOpacity style={styles.activeToggleButton} onPress={() => setIsClub(true)}>
                <BoldText fontSize={16} style={{ color: Colors.white }}>
                  동아리
                </BoldText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.inactiveToggleButton} onPress={() => setIsClub(true)}>
                <RegularText fontSize={16}>동아리</RegularText>
              </TouchableOpacity>
            )}
          </View>

          {isClub ? (
            <ClubTagModal selected={draftSelectedClubs} setSelected={setDraftSelectedClubs} />
          ) : (
            <PersonTagModal selected={draftSelectedMembers} setSelected={setDraftSelectedMembers} />
          )}

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <BoldText fontSize={16} style={{ color: Colors.white }}>
              확인
            </BoldText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    marginTop: 500,
    height: 440,
    flexDirection: 'column',
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  toggleButtonContainer: { width: '100%', flexDirection: 'row', gap: 12 },
  activeToggleButton: {
    width: 79,
    height: 36,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  inactiveToggleButton: {
    width: 79,
    height: 36,
    backgroundColor: Colors.gray0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  confirmButton: {
    width: '100%',
    height: 56,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    marginTop: 20,
  },
});

export default TagModal;
