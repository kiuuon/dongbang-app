import { useCallback, useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Keyboard, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useMutation, useQuery } from '@tanstack/react-query';

import { editFeed, fetchFeedDetail } from '@/apis/feed/feed';
import COLORS from '@/constants/colors';
import CustomWebView from '@/components/common/CustomWebView';
import BoldText from '@/components/common/SemiBoldText';
import RegularText from '@/components/common/RegularText';
import CustomBottomSheet from '@/components/common/CustomBottomSheet';
import ClubTagModal from '@/components/feed/write/TagModal/ClubTagModal';
import PersonTagModal from '@/components/feed/write/TagModal/PersonTagModal';

function FeedEditScreen() {
  const { feedId } = useLocalSearchParams();
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedClubs, setSelectedClubs] = useState<string[]>([]);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isClub, setIsClub] = useState(false);
  const [draftSelectedMembers, setDraftSelectedMembers] = useState<string[]>(selectedMembers);
  const [draftSelectedClubs, setDraftSelectedClubs] = useState<string[]>(selectedClubs);
  const bottomSheetModalRef = useRef<BottomSheetModal | null>(null);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const { data: feed } = useQuery({
    queryKey: ['feedDetail', feedId],
    queryFn: () => fetchFeedDetail(feedId as string),
    throwOnError: (error) => {
      Alert.alert('피드 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.', error.message);
      return false;
    },
  });

  useFocusEffect(
    useCallback(() => {
      if (feed) {
        setSelectedMembers(feed.taggedUsers.map(({ user }: { user: { id: string } }) => user.id));
        setSelectedClubs(feed.taggedClubs.map(({ club }: { club: { id: string } }) => club.id));
        setDraftSelectedMembers(feed.taggedUsers.map(({ user }: { user: { id: string } }) => user.id));
        setDraftSelectedClubs(feed.taggedClubs.map(({ club }: { club: { id: string } }) => club.id));
      }
    }, [feed]),
  );

  const { mutate: editFeedMutation } = useMutation({
    mutationFn: (body: {
      photos: string[];
      title: string;
      content: string;
      isNicknameVisible: boolean;
      isPrivate: boolean;
      selectedMembers: string[];
      selectedClubs: string[];
    }) =>
      editFeed(
        feedId as string,
        body.photos,
        body.title,
        body.content,
        body.isNicknameVisible,
        body.isPrivate,
        body.selectedMembers,
        body.selectedClubs,
      ),
    onSuccess: () => {
      router.back();
    },
    onError: (error) => {
      Alert.alert('피드를 작성하는데 실패했습니다. 다시 시도해주세요.', error.message);
      router.back();
    },
  });

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
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/feed/edit/${feedId}` }}
        onMessage={(data) => {
          const { type, action, payload } = data;
          if (type === 'event') {
            if (action === 'open tag modal') {
              setIsTagModalOpen(true);
            } else if (action === 'edit feed') {
              const { photos, title, content, isNicknameVisible, isPrivate } = payload;
              const body = {
                photos,
                title: title || '',
                content: content || '',
                isNicknameVisible,
                isPrivate,
                selectedMembers: draftSelectedMembers,
                selectedClubs: draftSelectedClubs,
              };

              editFeedMutation(body);
            }
          }
        }}
      />
      {isTagModalOpen && (
        <CustomBottomSheet
          isOpen={isTagModalOpen}
          onClose={() => setIsTagModalOpen(false)}
          sheetRef={bottomSheetModalRef}
          indicator={false}
        >
          <View style={styles.toggleButtonContainer}>
            {isClub ? (
              <TouchableOpacity style={styles.inactiveToggleButton} onPress={() => toggleClubMode(false)}>
                <RegularText fontSize={16}>개인</RegularText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.activeToggleButton} onPress={() => toggleClubMode(false)}>
                <BoldText fontSize={16} style={{ color: COLORS.white }}>
                  개인
                </BoldText>
              </TouchableOpacity>
            )}
            {isClub ? (
              <TouchableOpacity style={styles.activeToggleButton} onPress={() => toggleClubMode(true)}>
                <BoldText fontSize={16} style={{ color: COLORS.white }}>
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
              clubId={feed.club_id as string}
              selected={draftSelectedClubs}
              setSelected={setDraftSelectedClubs}
              bottomSheetModalRef={bottomSheetModalRef}
            />
          ) : (
            <PersonTagModal
              clubId={feed.club_id as string}
              selected={draftSelectedMembers}
              setSelected={setDraftSelectedMembers}
              bottomSheetModalRef={bottomSheetModalRef}
            />
          )}

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <BoldText fontSize={16} style={{ color: COLORS.white }}>
              확인
            </BoldText>
          </TouchableOpacity>
        </CustomBottomSheet>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  toggleButtonContainer: { width: '100%', flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginTop: 20 },
  activeToggleButton: {
    width: 79,
    height: 36,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  inactiveToggleButton: {
    width: 79,
    height: 36,
    backgroundColor: COLORS.gray0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  confirmButton: {
    height: 56,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 20,
  },
});

export default FeedEditScreen;
