import { useRef, useState, useCallback } from 'react';
import { TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
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
import TaggedClubModal from '@/components/feed/modal/TaggedClubModal';
import TaggedUserModal from '@/components/feed/modal/TaggedUserModal';
import SettingModal from '@/components/feed/modal/SettingModal';
import InteractModal from '@/components/feed/modal/InteractModal';
import LoginModal from '@/components/common/LoginModal';
import LikesModal from '@/components/feed/modal/LikesModal';

const { height } = Dimensions.get('window');

function FeedScreen() {
  const { clubType } = useLocalSearchParams();
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [isTaggedUserModalOpen, setIsTaggedUserModalOpen] = useState(false);
  const [isTaggedClubModalOpen, setIsTaggedClubModalOpen] = useState(false);
  const [isInteractModalOpen, setIsInteractModalOpen] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [key, setKey] = useState(0);

  const [selectedFeedId, setSelectedFeedId] = useState<string>('');
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);
  const [taggedUsers, setTaggedUsers] = useState<{ user: { name: string; avatar: string } }[]>([]);
  const [taggedClubs, setTaggedClubs] = useState<{ club: { name: string; logo: string } }[]>([]);

  const setSearchTarget = exploreStore((state) => state.setSearchTarget);
  const setKeyword = exploreStore((state) => state.setKeyword);
  const setSelectedHashtag = exploreStore((state) => state.setSelectedHashtag);

  const webViewRef = useRef(null);

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

          if (!ss && clubType !== 'union') {
            router.push('/feed/union');
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
              setIsTaggedClubModalOpen(true);
            } else if (action === 'setting click') {
              const { feedId, authorId } = payload;
              setSelectedFeedId(feedId);
              setSelectedAuthorId(authorId);
              setIsSettingModalOpen(true);
            } else if (action === 'interact click') {
              setSelectedFeedId(payload);
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
            } else if (action === 'go to login page') {
              router.push('/login');
            } else if (action === 'open login modal') {
              setIsLoginModalOpen(true);
            } else if (action === 'open likes modal') {
              setSelectedFeedId(payload);
              setIsLikesModalOpen(true);
            } else if (action === 'open comments bottom sheet') {
              // TODO: 댓글 바텀시트 열기
            }
          }
        }}
      />

      <LoginModal visible={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} webViewRef={webViewRef} />

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
      </CustomBottomSheet>

      <CustomBottomSheet
        isOpen={isLikesModalOpen}
        onClose={() => setIsLikesModalOpen(false)}
        scrollable
        height={height * 0.66}
        title="좋아요"
      >
        <LikesModal feedId={selectedFeedId} />
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
        <SettingModal
          authorId={selectedAuthorId as string}
          feedId={selectedFeedId}
          onClose={() => setIsSettingModalOpen(false)}
          isFeedDetail={false}
          webViewRef={webViewRef}
        />
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
    marginHorizontal: 20,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray0,
  },
});

export default FeedScreen;
