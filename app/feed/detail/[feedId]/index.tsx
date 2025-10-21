import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';

import COLORS from '@/constants/colors';
import CustomWebView from '@/components/common/CustomWebView';
import CustomBottomSheet from '@/components/common/CustomBottomSheet';
import TaggedClubModal from '@/components/feed/modal/TaggedClubModal';
import TaggedUserModal from '@/components/feed/modal/TaggedUserModal';
import SettingModal from '@/components/feed/modal/SettingModal';
import InteractModal from '@/components/feed/modal/InteractModal';
import exploreStore from '@/stores/exploreStore';

function FeedDetailScreen() {
  const { feedId } = useLocalSearchParams();
  const [isTaggedUserModalOpen, setIsTaggedUserModalOpen] = useState(false);
  const [isTaggedClubModalOpen, setIsTaggedClubModalOpen] = useState(false);
  const [isInteractModalOpen, setIsInteractModalOpen] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);

  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);
  const [taggedUsers, setTaggedUsers] = useState<{ user: { name: string; avatar: string } }[]>([]);
  const [taggedClubs, setTaggedClubs] = useState<{ club: { name: string; logo: string } }[]>([]);

  const setSearchTarget = exploreStore((state) => state.setSearchTarget);
  const setKeyword = exploreStore((state) => state.setKeyword);
  const setSelectedHashtag = exploreStore((state) => state.setSelectedHashtag);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/feed/detail/${feedId}` }}
        onMessage={(data) => {
          const { type, payload } = data;
          if (type === 'tagged club click') {
            setTaggedClubs(payload);
            setIsTaggedClubModalOpen(true);
          } else if (type === 'setting click') {
            const { authorId } = payload;
            setSelectedAuthorId(authorId);
            setIsSettingModalOpen(true);
          } else if (type === 'interact click') {
            setIsInteractModalOpen(true);
          } else if (type === 'tagged user click') {
            setTaggedUsers(payload);
            setIsTaggedUserModalOpen(true);
          } else if (type === 'hashtag click') {
            const hashtag = payload.trim();
            setSearchTarget('hashtag');
            setKeyword(hashtag);
            setSelectedHashtag(hashtag);
            router.push(`/explore`);
          }
        }}
      />

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

export default FeedDetailScreen;
