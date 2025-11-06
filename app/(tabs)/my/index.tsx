import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Dimensions } from 'react-native';

import CustomWebView from '@/components/common/CustomWebView';
import COLORS from '@/constants/colors';
import { useRef, useState } from 'react';
import exploreStore from '@/stores/exploreStore';
import CustomBottomSheet from '@/components/common/CustomBottomSheet';
import LikesModal from '@/components/feed/modal/LikesModal';
import TaggedClubModal from '@/components/feed/modal/TaggedClubModal';
import TaggedUserModal from '@/components/feed/modal/TaggedUserModal';
import SettingModal from '@/components/feed/modal/SettingModal';

const { height } = Dimensions.get('window');

function MyScreen() {
  const [key, setKey] = useState(0);
  const [isTaggedUserModalOpen, setIsTaggedUserModalOpen] = useState(false);
  const [isTaggedClubModalOpen, setIsTaggedClubModalOpen] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [selectedFeedId, setSelectedFeedId] = useState<string>('');
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);
  const [taggedUsers, setTaggedUsers] = useState<{ user: { id: string; name: string; avatar: string } }[]>([]);
  const [taggedClubs, setTaggedClubs] = useState<{ club: { id: string; name: string; logo: string } }[]>([]);

  const setSearchTarget = exploreStore((state) => state.setSearchTarget);
  const setKeyword = exploreStore((state) => state.setKeyword);
  const setSelectedHashtag = exploreStore((state) => state.setSelectedHashtag);

  const webViewRef = useRef(null);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        key={key}
        setKey={setKey}
        ref={webViewRef}
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/mypage` }}
        onMessage={(data) => {
          const { type, action, payload } = data;

          if (type === 'event') {
            if (action === 'go to login page') {
              router.push('/login');
            } else if (action === 'go to account setting page') {
              router.push('/account-setting');
            } else if (action === 'tagged club click') {
              setTaggedClubs(payload);
              setIsTaggedClubModalOpen(true);
            } else if (action === 'setting click') {
              const { feedId, authorId } = payload;
              setSelectedFeedId(feedId);
              setSelectedAuthorId(authorId);
              setIsSettingModalOpen(true);
            } else if (action === 'tagged user click') {
              setTaggedUsers(payload);
              setIsTaggedUserModalOpen(true);
            } else if (action === 'hashtag click') {
              const hashtag = payload.trim();
              setSearchTarget('hashtag');
              setKeyword(hashtag);
              setSelectedHashtag(hashtag);
              router.push(`/explore`);
            } else if (action === 'open likes modal') {
              setSelectedFeedId(payload);
              setIsLikesModalOpen(true);
            } else if (action === 'open comments bottom sheet') {
              // TODO: 댓글 바텀시트 열기
            } else if (action === 'go to feed detail page') {
              setSelectedFeedId(payload);
              router.push(`/feed/detail/${payload}`);
            } else if (action === 'go to club page') {
              router.push(`/my/club/${payload}`);
            }
          }
        }}
      />

      <CustomBottomSheet
        isOpen={isLikesModalOpen}
        onClose={() => setIsLikesModalOpen(false)}
        scrollable
        height={height * 0.66}
        title="좋아요"
      >
        <LikesModal feedId={selectedFeedId} onClose={() => setIsLikesModalOpen(false)} currentPath="/my" />
      </CustomBottomSheet>

      <CustomBottomSheet
        isOpen={isTaggedClubModalOpen}
        onClose={() => setIsTaggedClubModalOpen(false)}
        scrollable={(taggedClubs.length as number) > 4 && true}
        height={(taggedClubs.length as number) > 4 ? 300 : -1}
        scrollViewHeight={(taggedClubs.length as number) > 4 ? 190 : '100%'}
        title="피드에 태그된 동아리"
      >
        <TaggedClubModal taggedClubs={taggedClubs} onClose={() => setIsTaggedClubModalOpen(false)} currentPath="/my" />
      </CustomBottomSheet>

      <CustomBottomSheet
        isOpen={isTaggedUserModalOpen}
        onClose={() => setIsTaggedUserModalOpen(false)}
        scrollable={(taggedUsers.length as number) > 4 && true}
        height={(taggedUsers.length as number) > 4 ? 300 : -1}
        scrollViewHeight={(taggedUsers.length as number) > 4 ? 190 : '100%'}
        title="피드에 태그된 사람"
      >
        <TaggedUserModal taggedUsers={taggedUsers} onClose={() => setIsTaggedUserModalOpen(false)} currentPath="/my" />
      </CustomBottomSheet>

      <CustomBottomSheet isOpen={isSettingModalOpen} onClose={() => setIsSettingModalOpen(false)}>
        <SettingModal
          authorId={selectedAuthorId as string}
          feedId={selectedFeedId}
          onClose={() => setIsSettingModalOpen(false)}
          isFeedDetail={false}
          webViewRef={webViewRef}
        />
      </CustomBottomSheet>
    </SafeAreaView>
  );
}

export default MyScreen;
