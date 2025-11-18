import { useRef, useState } from 'react';
import { Dimensions, RefreshControl, ScrollView } from 'react-native';
import WebView from 'react-native-webview';
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
import LoginModal from '@/components/common/LoginModal';
import LikesModal from '@/components/feed/modal/LikesModal';

const { height } = Dimensions.get('window');

function FeedDetailScreen() {
  const { feedId } = useLocalSearchParams() as { feedId: string };
  const [isTaggedUserModalOpen, setIsTaggedUserModalOpen] = useState(false);
  const [isTaggedClubModalOpen, setIsTaggedClubModalOpen] = useState(false);
  const [isInteractModalOpen, setIsInteractModalOpen] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);
  const [taggedUsers, setTaggedUsers] = useState<{ user: { id: string; name: string; avatar: string } }[]>([]);
  const [taggedClubs, setTaggedClubs] = useState<{ club: { id: string; name: string; logo: string } }[]>([]);

  const setSearchTarget = exploreStore((state) => state.setSearchTarget);
  const setKeyword = exploreStore((state) => state.setKeyword);
  const setSelectedHashtag = exploreStore((state) => state.setSelectedHashtag);

  const [key, setKey] = useState(0);

  const webViewRef = useRef<WebView>(null);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    webViewRef.current?.reload();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <CustomWebView
          key={key}
          setKey={setKey}
          ref={webViewRef}
          source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/feed/detail/${feedId}` }}
          onMessage={(data) => {
            const { type, action, payload } = data;
            if (type === 'event') {
              if (action === 'tagged club click') {
                setTaggedClubs(payload);
                setIsTaggedClubModalOpen(true);
              } else if (action === 'setting click') {
                const { authorId } = payload;
                setSelectedAuthorId(authorId);
                setIsSettingModalOpen(true);
              } else if (action === 'interact click') {
                setIsInteractModalOpen(true);
              } else if (action === 'tagged user click') {
                setTaggedUsers(payload);
                setIsTaggedUserModalOpen(true);
              } else if (action === 'hashtag click') {
                const hashtag = payload.trim();
                setSearchTarget('hashtag');
                setKeyword(hashtag);
                setSelectedHashtag(hashtag);
                router.push(`/explore`);
              } else if (action === 'open login modal') {
                setIsLoginModalOpen(true);
              } else if (action === 'open likes modal') {
                setIsLikesModalOpen(true);
              } else if (action === 'go to comment likes page') {
                router.push(`/feed/detail/${feedId}/comment/${payload}/likes`);
              } else if (action === 'go to club page') {
                router.push(`/club/detail/${payload}`);
              } else if (action === 'go to profile page') {
                router.push(`/profile/${payload}`);
              }
            }
          }}
        />
      </ScrollView>

      <LoginModal visible={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} webViewRef={webViewRef} />

      <CustomBottomSheet
        isOpen={isLikesModalOpen}
        onClose={() => setIsLikesModalOpen(false)}
        scrollable
        height={height * 0.66}
        title="좋아요"
      >
        <LikesModal feedId={feedId} onClose={() => setIsLikesModalOpen(false)} currentPath="" />
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
          currentPath="/feed/detail"
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
        <TaggedUserModal taggedUsers={taggedUsers} onClose={() => setIsTaggedUserModalOpen(false)} currentPath="" />
      </CustomBottomSheet>

      <CustomBottomSheet isOpen={isSettingModalOpen} onClose={() => setIsSettingModalOpen(false)}>
        <SettingModal
          authorId={selectedAuthorId as string}
          feedId={feedId}
          onClose={() => setIsSettingModalOpen(false)}
          isFeedDetail
          webViewRef={webViewRef}
        />
      </CustomBottomSheet>

      <CustomBottomSheet isOpen={isInteractModalOpen} onClose={() => setIsInteractModalOpen(false)}>
        <InteractModal />
      </CustomBottomSheet>
    </SafeAreaView>
  );
}

export default FeedDetailScreen;
