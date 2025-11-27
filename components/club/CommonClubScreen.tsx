import { useRef, useState } from 'react';
import { Dimensions, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import WebView from 'react-native-webview';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';

import COLORS from '@/constants/colors';
import exploreStore from '@/stores/exploreStore';
import LeftArrowIcon from '@/icons/LeftArrowIcon';
import ReportIcon2 from '@/icons/ReportIcon2';
import MoreVertIcon from '@/icons/MoreVertIcon';
import ExternalLinkIcon from '@/icons/ExternalLinkIcon';
import MessageIcon from '@/icons/MessageIcon';
import CustomWebView from '@/components/common/CustomWebView';
import CustomBottomSheet from '@/components/common/CustomBottomSheet';
import LikesModal from '@/components/feed/modal/LikesBottomSheet';
import TaggedClubModal from '@/components/feed/modal/TaggedClubBottomSheet';
import TaggedUserModal from '@/components/feed/modal/TaggedUserBottomSheet';
import SettingModal from '@/components/feed/modal/SettingBottomSheet';
import WriteModal from '@/components/club/WriteModal';
import MembersModal from '@/components/club/MembersModal';
import LoginModal from '../common/LoginModal';
import RegularText from '../common/RegularText';

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

  const [isHeaderBackgroundWhite, setIsHeaderBackgroundWhite] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const moreButtonRef = useRef<View>(null);

  const { top } = useSafeAreaInsets();

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const setSearchTarget = exploreStore((state) => state.setSearchTarget);
  const setKeyword = exploreStore((state) => state.setKeyword);
  const setSelectedHashtag = exploreStore((state) => state.setSelectedHashtag);

  const webViewRef = useRef<WebView>(null);

  const handleLoadEnd = () => {
    webViewRef.current?.postMessage(
      JSON.stringify({
        type: 'event',
        action: 'set top in club page',
        payload: { top },
      }),
    );
  };

  const clickShareButton = async () => {
    try {
      const url = `${process.env.EXPO_PUBLIC_WEB_URL}/club/${clubId}`;
      await Clipboard.setStringAsync(url);
      Toast.show({
        type: 'success',
        text1: '복사 완료!',
        text2: '동아리 링크가 클립보드에 복사되었습니다!',
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      Toast.show({
        type: 'error',
        text1: '복사 실패!',
        text2: '동아리 링크 복사에 실패했습니다. 다시 시도해주세요.',
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <SafeAreaView
          edges={['top']}
          style={{
            backgroundColor: isHeaderBackgroundWhite ? COLORS.white : COLORS.transparent,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: 60,
              paddingHorizontal: 20,
            }}
          >
            <TouchableOpacity onPress={() => router.back()}>
              <LeftArrowIcon color={isHeaderBackgroundWhite ? COLORS.black : COLORS.white} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <TouchableOpacity>
                <MessageIcon color={isHeaderBackgroundWhite ? COLORS.black : COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity onPress={clickShareButton}>
                <ExternalLinkIcon color={isHeaderBackgroundWhite ? COLORS.black : COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity
                ref={moreButtonRef}
                onPress={() => {
                  moreButtonRef.current?.measureInWindow((x, y) => {
                    setDropdownPosition({ x, y });
                  });
                  setIsDropdownOpen(true);
                }}
              >
                <MoreVertIcon color={isHeaderBackgroundWhite ? COLORS.black : COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>

          <Modal transparent visible={isDropdownOpen} animationType="fade">
            <TouchableWithoutFeedback onPress={() => setIsDropdownOpen(false)}>
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
            </TouchableWithoutFeedback>

            <View style={[styles.dropdownContainer, { top: dropdownPosition.y + 40, left: dropdownPosition.x - 55 }]}>
              <TouchableOpacity style={styles.dropdownItem}>
                <ReportIcon2 />
                <RegularText fontSize={16} style={{ color: COLORS.error }}>
                  신고
                </RegularText>
              </TouchableOpacity>
            </View>
          </Modal>
        </SafeAreaView>
      </View>

      <CustomWebView
        ref={webViewRef}
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/club/${clubId}` }}
        onLoadEnd={handleLoadEnd}
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
            } else if (action === 'scroll event') {
              setIsHeaderBackgroundWhite(payload);
            }
          }
        }}
      />

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
    </View>
  );
}

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  dropdownContainer: {
    position: 'absolute',
    width: 77,
    right: 0,
    top: 24,
    zIndex: 10,
    flexDirection: 'column',
    gap: 11,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    padding: 10,
    // iOS shadow
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    // Android shadow
    elevation: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

export default CommonClubScreen;
