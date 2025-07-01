import { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { writeFeed } from '@/apis/feed';
import Colors from '@/constants/colors';
import CustomWebView from '@/components/common/CustomWebView';
import BoldText from '@/components/common/SemiBoldText';
import RegularText from '@/components/common/RegularText';
import CustomBottomSheet from '@/components/common/CustomBottomSheet';
import ClubTagModal from '@/components/feed/write/TagModal/ClubTagModal';
import PersonTagModal from '@/components/feed/write/TagModal/PersonTagModal';

function FeedWriteScreen() {
  const { clubId } = useLocalSearchParams();
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedClubs, setSelectedClubs] = useState<string[]>([]);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isClub, setIsClub] = useState(false);
  const [draftSelectedMembers, setDraftSelectedMembers] = useState<string[]>(selectedMembers);
  const [draftSelectedClubs, setDraftSelectedClubs] = useState<string[]>(selectedClubs);
  const bottomSheetModalRef = useRef<BottomSheetModal | null>(null);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardOpen(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardOpen(false);
    });
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleConfirm = () => {
    Keyboard.dismiss();
    setSelectedMembers(draftSelectedMembers);
    setSelectedClubs(draftSelectedClubs);
    setIsTagModalOpen(false);
  };

  const toggleClubMode = (is: boolean) => {
    if (!isKeyboardOpen) {
      setIsClub(is);
      return;
    }

    const listener = Keyboard.addListener('keyboardWillHide', () => {
      setIsClub(is);
      listener.remove();
    });

    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/feed/write/${clubId}` }}
        onMessage={async (event) => {
          if (event.nativeEvent.data === 'open tag modal') {
            setIsTagModalOpen(true);
          } else {
            const { photos, title, content, isNicknameVisible, isPrivate } = JSON.parse(event.nativeEvent.data);
            writeFeed(
              photos,
              title,
              content,
              isNicknameVisible,
              isPrivate,
              clubId as string,
              selectedMembers,
              selectedClubs,
            );
            router.replace(`/club/${clubId}`);
          }
        }}
      />
      {isTagModalOpen && (
        <CustomBottomSheet
          isOpen={isTagModalOpen}
          onClose={() => setIsTagModalOpen(false)}
          sheetRef={bottomSheetModalRef}
        >
          <View style={styles.toggleButtonContainer}>
            {isClub ? (
              <TouchableOpacity style={styles.inactiveToggleButton} onPress={() => toggleClubMode(false)}>
                <RegularText fontSize={16}>개인</RegularText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.activeToggleButton} onPress={() => toggleClubMode(false)}>
                <BoldText fontSize={16} style={{ color: Colors.white }}>
                  개인
                </BoldText>
              </TouchableOpacity>
            )}
            {isClub ? (
              <TouchableOpacity style={styles.activeToggleButton} onPress={() => toggleClubMode(true)}>
                <BoldText fontSize={16} style={{ color: Colors.white }}>
                  동아리
                </BoldText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.inactiveToggleButton} onPress={() => toggleClubMode(true)}>
                <RegularText fontSize={16}>동아리</RegularText>
              </TouchableOpacity>
            )}
          </View>

          {isClub ? (
            <ClubTagModal
              selected={draftSelectedClubs}
              setSelected={setDraftSelectedClubs}
              bottomSheetModalRef={bottomSheetModalRef}
            />
          ) : (
            <PersonTagModal
              clubId={clubId as string}
              selected={draftSelectedMembers}
              setSelected={setDraftSelectedMembers}
              bottomSheetModalRef={bottomSheetModalRef}
            />
          )}

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <BoldText fontSize={16} style={{ color: Colors.white }}>
              확인
            </BoldText>
          </TouchableOpacity>
        </CustomBottomSheet>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 20,
  },
});

export default FeedWriteScreen;
