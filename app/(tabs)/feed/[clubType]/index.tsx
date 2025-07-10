import { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';

import BoldText from '@/components/common/SemiBoldText';
import CustomWebView from '@/components/common/CustomWebView';
import CustomBottomSheet from '@/components/common/CustomBottomSheet';
import Colors from '@/constants/colors';
import TaggedClubModal from '@/components/feed/modal/TaggedClubModal';
import TaggedUserModal from '@/components/feed/modal/TaggedUserModal';
import SettingModal from '@/components/feed/modal/SettingModal';
import InteractModal from '@/components/feed/modal/InteractModal';

function FeedScreen() {
  const { clubType } = useLocalSearchParams();
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [isTaggedUserModalOpen, setIsTaggedUserModalOpen] = useState(false);
  const [isTaggedClubModalOpen, setIsTaggedClubModalOpen] = useState(false);
  const [isInteractModalOpen, setIsInteractModalOpen] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);

  // TODO: 추후에 사용될 수 있는 상태 변수
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null);
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);
  const [taggedUsers, setTaggedUsers] = useState<{ user: { name: string; avatar: string } }[]>([]);
  const [taggedClubs, setTaggedClubs] = useState<{ club: { name: string; logo: string } }[]>([]);

  const goToSelectedClubType = (selectedClubType: string) => {
    router.replace(`/feed/${selectedClubType}`);
    setIsNavigationOpen(false);
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/feed/${clubType}` }}
        onMessage={(event) => {
          const { type, payload } = JSON.parse(event.nativeEvent.data);
          if (type === 'open navigation') {
            setIsNavigationOpen(true);
          } else if (type === 'tagged club click') {
            setTaggedClubs(payload);
            setIsTaggedClubModalOpen(true);
          } else if (type === 'setting click') {
            const { feedId, authorId } = payload;
            setSelectedFeedId(feedId);
            setSelectedAuthorId(authorId);
            setIsSettingModalOpen(true);
          } else if (type === 'interact click') {
            setSelectedFeedId(payload);
            setIsInteractModalOpen(true);
          } else if (type === 'tagged user click') {
            setTaggedUsers(payload);
            setIsTaggedUserModalOpen(true);
          }
        }}
      />
      <CustomBottomSheet isOpen={isNavigationOpen} onClose={() => setIsNavigationOpen(false)}>
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
      </CustomBottomSheet>

      <CustomBottomSheet
        isOpen={isTaggedClubModalOpen}
        onClose={() => setIsTaggedClubModalOpen(false)}
        scrollable={(taggedClubs.length as number) > 4 && true}
        height={(taggedClubs.length as number) > 4 ? 300 : -1}
        scrollViewHeight={(taggedClubs.length as number) > 4 ? 190 : '100%'}
        title="피드에 태그된 동아리"
      >
        <TaggedClubModal taggedClubs={taggedClubs} />
      </CustomBottomSheet>

      <CustomBottomSheet
        isOpen={isTaggedUserModalOpen}
        onClose={() => setIsTaggedUserModalOpen(false)}
        scrollable={(taggedUsers.length as number) > 4 && true}
        height={(taggedUsers.length as number) > 4 ? 300 : -1}
        scrollViewHeight={(taggedUsers.length as number) > 4 ? 190 : '100%'}
        title="피드에 태그된 사람"
      >
        <TaggedUserModal taggedUsers={taggedUsers} />
      </CustomBottomSheet>

      <CustomBottomSheet isOpen={isSettingModalOpen} onClose={() => setIsSettingModalOpen(false)}>
        <SettingModal authorId={selectedAuthorId as string} />
      </CustomBottomSheet>

      <CustomBottomSheet isOpen={isInteractModalOpen} onClose={() => setIsInteractModalOpen(false)}>
        <InteractModal />
      </CustomBottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalButton: {
    width: '100%',
    paddingVertical: 24,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray0,
  },
});

export default FeedScreen;
