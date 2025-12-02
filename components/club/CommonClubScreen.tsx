import { useRef, useState } from 'react';
import { Alert, Dimensions, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import WebView from 'react-native-webview';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';

import { leaveClub } from '@/apis/club';
import COLORS from '@/constants/colors';
import { ERROR_MESSAGE } from '@/constants/error';
import exploreStore from '@/stores/exploreStore';
import LeftArrowIcon from '@/icons/LeftArrowIcon';
import ReportIcon2 from '@/icons/ReportIcon2';
import LogoutIcon from '@/icons/LogoutIcon';
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
import FeedReportBottomsheet from '../report/FeedReportBottomsheet';
import ClubReportBottomsheet from '../report/ClubReportBottomsheet';
import BoldText from '../common/SemiBoldText';
import CommentBottomSheet from '../feed/modal/CommentBottomSheet/CommentBottomSheet';

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
  const [taggedUsers, setTaggedUsers] = useState<
    { user: { id: string; name: string; avatar: string; nickname: string } }[]
  >([]);
  const [taggedClubs, setTaggedClubs] = useState<{ club: { id: string; name: string; logo: string } }[]>([]);

  const [isHeaderBackgroundWhite, setIsHeaderBackgroundWhite] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const moreButtonRef = useRef<View>(null);

  const { top } = useSafeAreaInsets();

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isFeedReportBottomSheetOpen, setIsFeedReportBottomSheetOpen] = useState(false);
  const [isFeedReportSuccess, setIsFeedReportSuccess] = useState(false);
  const [isClubReportBottomSheetOpen, setIsClubReportBottomSheetOpen] = useState(false);
  const [isClubLeaveModalOpen, setIsClubLeaveModalOpen] = useState(false);
  const [isCommentBottomSheetOpen, setIsCommentBottomSheetOpen] = useState(false);

  const setSearchTarget = exploreStore((state) => state.setSearchTarget);
  const setKeyword = exploreStore((state) => state.setKeyword);
  const setSelectedHashtag = exploreStore((state) => state.setSelectedHashtag);

  const webViewRef = useRef<WebView>(null);

  const { mutate: handleLeaveClub } = useMutation({
    mutationFn: async () => leaveClub(clubId as string),
    onSuccess: () => {
      setIsClubLeaveModalOpen(false);

      const message = {
        type: 'event',
        action: 'leave club',
        payload: clubId,
      };

      webViewRef.current?.postMessage(JSON.stringify(message));
    },
    onError: (error) => Alert.alert(ERROR_MESSAGE.CLUB.LEAVE_CLUB_FAILED, error.message),
  });

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
      {/* 헤더 영역 */}
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
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setIsClubReportBottomSheetOpen(true);
                  setIsDropdownOpen(false);
                }}
              >
                <ReportIcon2 />
                <RegularText fontSize={16} style={{ color: COLORS.error }}>
                  신고
                </RegularText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setIsClubLeaveModalOpen(true);
                  setIsDropdownOpen(false);
                }}
              >
                <LogoutIcon />
                <RegularText fontSize={16} style={{ color: COLORS.error }}>
                  탈퇴
                </RegularText>
              </TouchableOpacity>
            </View>
          </Modal>
        </SafeAreaView>
        {isClubLeaveModalOpen && (
          <Modal transparent visible={isClubLeaveModalOpen} animationType="fade">
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableWithoutFeedback onPress={() => setIsClubLeaveModalOpen(false)}>
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: COLORS.modalBackdrop,
                  }}
                />
              </TouchableWithoutFeedback>
              <View
                style={{
                  backgroundColor: COLORS.white,
                  padding: 20,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BoldText fontSize={14}>소속된 동아리에서 탈퇴하시겠습니까?</BoldText>
                <TouchableOpacity>
                  <BoldText
                    fontSize={14}
                    style={{ color: COLORS.error, marginBottom: 16, marginTop: 24 }}
                    onPress={() => handleLeaveClub()}
                  >
                    탈퇴 하기
                  </BoldText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsClubLeaveModalOpen(false)}>
                  <RegularText fontSize={14}>취소</RegularText>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
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
              setSelectedFeedId(payload);
              setIsCommentBottomSheetOpen(true);
            } else if (action === 'go to feed detail page') {
              setSelectedFeedId(payload);
              router.push(`/feed/detail/${payload}`);
            } else if (action === 'open members modal') {
              setIsMembersModalOpen(true);
            } else if (action === 'open login modal') {
              setIsLoginModalOpen(true);
            } else if (action === 'scroll event') {
              setIsHeaderBackgroundWhite(payload);
            } else if (action === 'go to announcement page') {
              router.push(`/club/detail/${clubId}/announcement`);
            }
          }
        }}
      />

      <CommentBottomSheet
        feedId={selectedFeedId}
        isOpen={isCommentBottomSheetOpen}
        onClose={() => {
          setIsCommentBottomSheetOpen(false);
        }}
        webViewRef={webViewRef}
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
        isOpen={isClubReportBottomSheetOpen}
        onClose={() => setIsClubReportBottomSheetOpen(false)}
        title="신고"
      >
        <ClubReportBottomsheet clubId={clubId as string} onClose={() => setIsClubReportBottomSheetOpen(false)} />
      </CustomBottomSheet>

      <CustomBottomSheet
        isOpen={isFeedReportBottomSheetOpen}
        onClose={() => setIsFeedReportBottomSheetOpen(false)}
        title={isFeedReportSuccess ? '신고가 접수되었습니다' : '신고'}
      >
        <FeedReportBottomsheet
          feedId={selectedFeedId}
          isReportSuccess={isFeedReportSuccess}
          setIsReportSuccess={setIsFeedReportSuccess}
          onClose={() => setIsFeedReportBottomSheetOpen(false)}
          webViewRef={webViewRef}
        />
      </CustomBottomSheet>

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
          setIsReportSuccess={setIsFeedReportSuccess}
          setIsReportBottomSheetOpen={setIsFeedReportBottomSheetOpen}
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
