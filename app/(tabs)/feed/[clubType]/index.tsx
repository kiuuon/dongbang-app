import { useRef, useState, useCallback } from 'react';
import { TouchableOpacity, StyleSheet, Alert, Dimensions, ScrollView, RefreshControl } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { fetchSession } from '@/apis/auth';
import COLORS from '@/constants/colors';
import { ERROR_MESSAGE } from '@/constants/error';
import exploreStore from '@/stores/exploreStore';
import BoldText from '@/components/common/SemiBoldText';
import CustomWebView from '@/components/common/CustomWebView';
import CustomBottomSheet from '@/components/common/CustomBottomSheet';
import LoginModal from '@/components/common/LoginModal';
import TaggedClubBottomSheet from '@/components/feed/modal/TaggedClubBottomSheet';
import TaggedUserBottomSheet from '@/components/feed/modal/TaggedUserBottomSheet';
import SettingBottomSheet from '@/components/feed/modal/SettingBottomSheet';
import LikesBottomSheet from '@/components/feed/modal/LikesBottomSheet';
import CommentBottomSheet from '@/components/feed/modal/CommentBottomSheet/CommentBottomSheet';
import FeedReportBottomsheet from '@/components/report/FeedReportBottomsheet';

const { height } = Dimensions.get('window');

function FeedScreen() {
  const { clubType } = useLocalSearchParams();
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [isTaggedUserBottomSheetOpen, setIsTaggedUserBottomSheetOpen] = useState(false);
  const [isTaggedClubBottomSheetOpen, setIsTaggedClubBottomSheetOpen] = useState(false);
  const [isSettingBottomSheetOpen, setIsSettingBottomSheetOpen] = useState(false);
  const [isLikesBottomSheetOpen, setIsLikesBottomSheetOpen] = useState(false);
  const [isCommentBottomSheetOpen, setIsCommentBottomSheetOpen] = useState(false);
  const [isReportBottomSheetOpen, setIsReportBottomSheetOpen] = useState(false);
  const [isReportSuccess, setIsReportSuccess] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [key, setKey] = useState(0);

  const [selectedFeedId, setSelectedFeedId] = useState<string>('');
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);
  const [taggedUsers, setTaggedUsers] = useState<
    { user: { id: string; name: string; nickname: string; avatar: string } }[]
  >([]);
  const [taggedClubs, setTaggedClubs] = useState<{ club: { id: string; name: string; logo: string } }[]>([]);

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

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.SESSION.FETCH_FAILED, error.message);
      return false;
    },
  });

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const ss = await fetchSession();
          if (!ss && clubType !== 'all' && clubType !== 'union') {
            router.push('/feed/all');
          }
        } catch (error) {
          Alert.alert(ERROR_MESSAGE.SESSION.FETCH_FAILED, (error as Error).message);
        }
      })();
    }, [clubType]),
  );

  const goToSelectedClubType = (selectedClubType: string) => {
    router.replace(`/feed/${selectedClubType}`);
    setIsNavigationOpen(false);
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <CustomWebView
          key={key}
          setKey={setKey}
          ref={webViewRef}
          source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/feed/${clubType}` }}
          onMessage={(data) => {
            const { type, action, payload } = data;
            if (type === 'event') {
              if (action === 'open navigation') {
                setIsNavigationOpen(true);
              } else if (action === 'tagged club click') {
                setTaggedClubs(payload);
                setIsTaggedClubBottomSheetOpen(true);
              } else if (action === 'setting click') {
                const { feedId, authorId } = payload;
                setSelectedFeedId(feedId);
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
              } else if (action === 'go to login page') {
                router.push('/login');
              } else if (action === 'open login modal') {
                setIsLoginModalOpen(true);
              } else if (action === 'open likes modal') {
                setSelectedFeedId(payload);
                setIsLikesBottomSheetOpen(true);
              } else if (action === 'open comments bottom sheet') {
                setSelectedFeedId(payload);
                setIsCommentBottomSheetOpen(true);
              } else if (action === 'go to club page') {
                router.push(`/feed/club/${payload}`);
              }
            }
          }}
        />
      </ScrollView>

      <LoginModal visible={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} webViewRef={webViewRef} />

      <CommentBottomSheet
        feedId={selectedFeedId}
        isOpen={isCommentBottomSheetOpen}
        onClose={() => {
          setIsCommentBottomSheetOpen(false);
        }}
      />

      <CustomBottomSheet
        isOpen={isReportBottomSheetOpen}
        onClose={() => setIsReportBottomSheetOpen(false)}
        title={isReportSuccess ? '신고가 접수되었습니다' : '신고'}
      >
        <FeedReportBottomsheet
          feedId={selectedFeedId}
          isReportSuccess={isReportSuccess}
          setIsReportSuccess={setIsReportSuccess}
          onClose={() => setIsReportBottomSheetOpen(false)}
          webViewRef={webViewRef}
        />
      </CustomBottomSheet>

      <CustomBottomSheet isOpen={isNavigationOpen} onClose={() => setIsNavigationOpen(false)}>
        {clubType !== 'my' && (
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              if (session) {
                goToSelectedClubType('my');
              } else {
                setIsNavigationOpen(false);
                setIsLoginModalOpen(true);
              }
            }}
          >
            <BoldText fontSize={16}>내 동아리</BoldText>
          </TouchableOpacity>
        )}
        {clubType !== 'campus' && (
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              if (session) {
                goToSelectedClubType('campus');
              } else {
                setIsNavigationOpen(false);
                setIsLoginModalOpen(true);
              }
            }}
          >
            <BoldText fontSize={16}>교내 동아리</BoldText>
          </TouchableOpacity>
        )}
        {clubType !== 'union' && (
          <TouchableOpacity style={styles.modalButton} onPress={() => goToSelectedClubType('union')}>
            <BoldText fontSize={16}>연합 동아리</BoldText>
          </TouchableOpacity>
        )}
        {clubType !== 'all' && (
          <TouchableOpacity style={styles.modalButton} onPress={() => goToSelectedClubType('all')}>
            <BoldText fontSize={16}>모든 동아리</BoldText>
          </TouchableOpacity>
        )}
      </CustomBottomSheet>

      <CustomBottomSheet
        isOpen={isLikesBottomSheetOpen}
        onClose={() => setIsLikesBottomSheetOpen(false)}
        scrollable
        height={height * 0.66}
        title="좋아요"
      >
        <LikesBottomSheet
          feedId={selectedFeedId}
          onClose={() => setIsLikesBottomSheetOpen(false)}
          currentPath="/feed"
        />
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
          taggedClubs={taggedClubs}
          onClose={() => setIsTaggedClubBottomSheetOpen(false)}
          currentPath="/feed"
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
          currentPath="/feed"
        />
      </CustomBottomSheet>

      <CustomBottomSheet isOpen={isSettingBottomSheetOpen} onClose={() => setIsSettingBottomSheetOpen(false)}>
        <SettingBottomSheet
          authorId={selectedAuthorId as string}
          feedId={selectedFeedId}
          onClose={() => setIsSettingBottomSheetOpen(false)}
          isFeedDetail={false}
          webViewRef={webViewRef}
          setIsReportSuccess={setIsReportSuccess}
          setIsReportBottomSheetOpen={setIsReportBottomSheetOpen}
        />
      </CustomBottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalButton: {
    width: '100%',
    paddingVertical: 24,
    marginHorizontal: 20,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray0,
  },
});

export default FeedScreen;
