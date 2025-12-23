import { useRef, useState } from 'react';
import { Dimensions, RefreshControl, ScrollView } from 'react-native';
import WebView from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';

import COLORS from '@/constants/colors';
import exploreStore from '@/stores/exploreStore';
import CustomWebView from '@/components/common/CustomWebView';
import CustomBottomSheet from '@/components/common/CustomBottomSheet';
import LoginModal from '@/components/common/LoginModal';
import TaggedClubBottomSheet from '@/components/feed/modal/TaggedClubBottomSheet';
import TaggedUserBottomSheet from '@/components/feed/modal/TaggedUserBottomSheet';
import SettingBottomSheet from '@/components/feed/modal/SettingBottomSheet';
import LikesBottomSheet from '@/components/feed/modal/LikesBottomSheet';
import FeedReportBottomsheet from '@/components/report/FeedReportBottomsheet';
import CommentReportBottomsheet from '@/components/report/CommentReportBottomsheet';

const { height } = Dimensions.get('window');

function FeedDetailScreen() {
  const { feedId } = useLocalSearchParams() as { feedId: string };
  const [isTaggedUserBottomSheetOpen, setIsTaggedUserBottomSheetOpen] = useState(false);
  const [isTaggedClubBottomSheetOpen, setIsTaggedClubBottomSheetOpen] = useState(false);
  const [isSettingBottomSheetOpen, setIsSettingBottomSheetOpen] = useState(false);
  const [isLikesBottomSheetOpen, setIsLikesBottomSheetOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isFeedReportBottomSheetOpen, setIsFeedReportBottomSheetOpen] = useState(false);
  const [isFeedReportSuccess, setIsFeedReportSuccess] = useState(false);
  const [isCommentReportBottomSheetOpen, setIsCommentReportBottomSheetOpen] = useState(false);
  const [isCommentReportSuccess, setIsCommentReportSuccess] = useState(false);

  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);
  const [taggedUsers, setTaggedUsers] = useState<
    { user: { id: string; name: string; avatar: string; nickname: string; deleted_at: string | null } }[]
  >([]);
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
                const { taggedClubs: taggedClubsPayload } = payload;
                setTaggedClubs(taggedClubsPayload);
                setIsTaggedClubBottomSheetOpen(true);
              } else if (action === 'setting click') {
                const { authorId } = payload;
                setSelectedAuthorId(authorId);
                setIsSettingBottomSheetOpen(true);
              } else if (action === 'tagged user click') {
                setTaggedUsers(payload);
                setIsTaggedUserBottomSheetOpen(true);
              } else if (action === 'hashtag click') {
                const hashtag = payload.trim();
                setSearchTarget('hashtag');
                setKeyword(hashtag);
                setSelectedHashtag(hashtag);
                router.push(`/explore`);
              } else if (action === 'open login modal') {
                setIsLoginModalOpen(true);
              } else if (action === 'open likes modal') {
                setIsLikesBottomSheetOpen(true);
              } else if (action === 'go to comment likes page') {
                router.push(`/feed/detail/${feedId}/comment/${payload}/likes`);
              } else if (action === 'go to club page') {
                router.push(`/club/detail/${payload}`);
              } else if (action === 'go to profile page') {
                router.push(`/profile/${payload}`);
              } else if (action === 'open comment report bottom sheet') {
                setSelectedCommentId(payload);
                setIsCommentReportBottomSheetOpen(true);
                setIsCommentReportSuccess(false);
              }
            }
          }}
        />
      </ScrollView>

      <LoginModal visible={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} webViewRef={webViewRef} />

      <CustomBottomSheet
        isOpen={isFeedReportBottomSheetOpen}
        onClose={() => setIsFeedReportBottomSheetOpen(false)}
        title={isFeedReportSuccess ? '신고가 접수되었습니다' : '신고'}
      >
        <FeedReportBottomsheet
          feedId={feedId}
          isReportSuccess={isFeedReportSuccess}
          setIsReportSuccess={setIsFeedReportSuccess}
          onClose={() => setIsFeedReportBottomSheetOpen(false)}
          webViewRef={webViewRef}
        />
      </CustomBottomSheet>
      <CustomBottomSheet
        isOpen={isCommentReportBottomSheetOpen}
        onClose={() => setIsCommentReportBottomSheetOpen(false)}
        title={isCommentReportSuccess ? '신고가 접수되었습니다' : '신고'}
      >
        <CommentReportBottomsheet
          commentId={selectedCommentId as string}
          isReportSuccess={isCommentReportSuccess}
          setIsReportSuccess={setIsCommentReportSuccess}
          onClose={() => setIsCommentReportBottomSheetOpen(false)}
          webViewRef={webViewRef}
        />
      </CustomBottomSheet>

      <CustomBottomSheet
        isOpen={isLikesBottomSheetOpen}
        onClose={() => setIsLikesBottomSheetOpen(false)}
        scrollable
        height={height * 0.66}
        title="좋아요"
      >
        <LikesBottomSheet feedId={feedId} onClose={() => setIsLikesBottomSheetOpen(false)} currentPath="" />
      </CustomBottomSheet>

      <CustomBottomSheet
        isOpen={isTaggedClubBottomSheetOpen}
        onClose={() => setIsTaggedClubBottomSheetOpen(false)}
        scrollable={(taggedClubs.length as number) > 4 && true}
        height={(taggedClubs.length as number) > 4 ? 300 : -1}
        scrollViewHeight={(taggedClubs.length as number) > 4 ? 190 : '100%'}
        title="피드에 태그된 동아리"
      >
        <TaggedClubBottomSheet
          feedId={feedId}
          taggedClubs={taggedClubs}
          onClose={() => setIsTaggedClubBottomSheetOpen(false)}
          currentPath="/feed/detail"
        />
      </CustomBottomSheet>

      <CustomBottomSheet
        isOpen={isTaggedUserBottomSheetOpen}
        onClose={() => setIsTaggedUserBottomSheetOpen(false)}
        scrollable={(taggedUsers.length as number) > 4 && true}
        height={(taggedUsers.length as number) > 4 ? 300 : -1}
        scrollViewHeight={(taggedUsers.length as number) > 4 ? 190 : '100%'}
        title="피드에 태그된 사람"
      >
        <TaggedUserBottomSheet
          taggedUsers={taggedUsers}
          onClose={() => setIsTaggedUserBottomSheetOpen(false)}
          currentPath=""
        />
      </CustomBottomSheet>

      <CustomBottomSheet isOpen={isSettingBottomSheetOpen} onClose={() => setIsSettingBottomSheetOpen(false)}>
        <SettingBottomSheet
          authorId={selectedAuthorId as string}
          feedId={feedId}
          onClose={() => setIsSettingBottomSheetOpen(false)}
          isFeedDetail
          webViewRef={webViewRef}
          setIsReportSuccess={setIsFeedReportSuccess}
          setIsReportBottomSheetOpen={setIsFeedReportBottomSheetOpen}
        />
      </CustomBottomSheet>
    </SafeAreaView>
  );
}

export default FeedDetailScreen;
