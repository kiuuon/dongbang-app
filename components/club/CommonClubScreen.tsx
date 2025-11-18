import { useRef, useState } from 'react';
import { Dimensions, RefreshControl, ScrollView } from 'react-native';
import WebView from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import COLORS from '@/constants/colors';
import exploreStore from '@/stores/exploreStore';
import CustomWebView from '@/components/common/CustomWebView';
import CustomBottomSheet from '@/components/common/CustomBottomSheet';
import LikesModal from '@/components/feed/modal/LikesModal';
import TaggedClubModal from '@/components/feed/modal/TaggedClubModal';
import TaggedUserModal from '@/components/feed/modal/TaggedUserModal';
import SettingModal from '@/components/feed/modal/SettingModal';
import WriteModal from '@/components/club/WriteModal';
import MembersModal from '@/components/club/MembersModal';
import LoginModal from '../common/LoginModal';

const { height } = Dimensions.get('window');

function CommonClubScreen({
  currentPath,
}: {
  currentPath: '' | '/my' | '/feed' | '/explore' | '/interact' | '/club' | '/feed/detail';
}) {
  const { clubId } = useLocalSearchParams();

  const [isTaggedUserModalOpen, setIsTaggedUserModalOpen] = useState(false);
  const [isTaggedClubModalOpen, setIsTaggedClubModalOpen] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [selectedFeedId, setSelectedFeedId] = useState<string>('');
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);
  const [taggedUsers, setTaggedUsers] = useState<{ user: { id: string; name: string; avatar: string } }[]>([]);
  const [taggedClubs, setTaggedClubs] = useState<{ club: { id: string; name: string; logo: string } }[]>([]);

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const setSearchTarget = exploreStore((state) => state.setSearchTarget);
  const setKeyword = exploreStore((state) => state.setKeyword);
  const setSelectedHashtag = exploreStore((state) => state.setSelectedHashtag);

  const webViewRef = useRef<WebView>(null);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    webViewRef.current?.reload();
    setRefreshing(false);
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <CustomWebView
          ref={webViewRef}
          source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/club/${clubId}` }}
          onMessage={(data) => {
            const { type, action, payload } = data;
            if (type === 'event') {
              if (action === 'go to coming soon page') {
                router.push('/coming-soon');
              } else if (action === 'open write modal') {
                setIsWriteModalOpen(true);
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
              } else if (action === 'open members modal') {
                setIsMembersModalOpen(true);
              } else if (action === 'open login modal') {
                setIsLoginModalOpen(true);
              }
            }
          }}
        />
      </ScrollView>

      <LoginModal visible={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} webViewRef={webViewRef} />

      <WriteModal visible={isWriteModalOpen} onClose={() => setIsWriteModalOpen(false)} clubId={clubId as string} />

      <MembersModal
        visible={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        clubId={clubId as string}
        currentPath={currentPath === '/feed/detail' ? '' : currentPath}
      />

      <CustomBottomSheet
        isOpen={isLikesModalOpen}
        onClose={() => setIsLikesModalOpen(false)}
        scrollable
        height={height * 0.66}
        title="좋아요"
      >
        <LikesModal
          feedId={selectedFeedId}
          onClose={() => setIsLikesModalOpen(false)}
          currentPath={currentPath === '/feed/detail' ? '' : currentPath}
        />
      </CustomBottomSheet>

      <CustomBottomSheet
        isOpen={isTaggedClubModalOpen}
        onClose={() => setIsTaggedClubModalOpen(false)}
        scrollable={(taggedClubs.length as number) > 4 && true}
        height={(taggedClubs.length as number) > 4 ? 300 : -1}
        scrollViewHeight={(taggedClubs.length as number) > 4 ? 190 : '100%'}
        title="피드에 태그된 동아리"
      >
        <TaggedClubModal
          taggedClubs={taggedClubs}
          onClose={() => setIsTaggedClubModalOpen(false)}
          currentPath={currentPath === '/club' ? '' : currentPath}
        />
      </CustomBottomSheet>

      <CustomBottomSheet
        isOpen={isTaggedUserModalOpen}
        onClose={() => setIsTaggedUserModalOpen(false)}
        scrollable={(taggedUsers.length as number) > 4 && true}
        height={(taggedUsers.length as number) > 4 ? 300 : -1}
        scrollViewHeight={(taggedUsers.length as number) > 4 ? 190 : '100%'}
        title="피드에 태그된 사람"
      >
        <TaggedUserModal
          taggedUsers={taggedUsers}
          onClose={() => setIsTaggedUserModalOpen(false)}
          currentPath={currentPath === '/feed/detail' ? '' : currentPath}
        />
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

export default CommonClubScreen;
