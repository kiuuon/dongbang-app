import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import COLORS from '@/constants/colors';
import useDebounce from '@/hooks/useDebounce';
import exploreStore from '@/stores/exploreStore';
import AdjustmentsIcon from '@/icons/AdjustmentsIcon';
import FilterList from '@/components/explore/club/FilterList';
import ClubSection from '@/components/explore/club/ClubSection';
import FeedSection from '@/components/explore/feed/FeedSection';
import HashtagSection from '@/components/explore/hashtag/HashtagSection';

function ExploreScreen() {
  const searchTarget = exploreStore((state) => state.searchTarget);
  const setSearchTarget = exploreStore((state) => state.setSearchTarget);
  const keyword = exploreStore((state) => state.keyword);
  const setKeyword = exploreStore((state) => state.setKeyword);
  const selectedHashtag = exploreStore((state) => state.selectedHashtag);
  const setSelectedHashtag = exploreStore((state) => state.setSelectedHashtag);

  const [isDetailSearchModalOpen, setIsDetailSearchModalOpen] = useState(false);

  const debouncedKeyword = useDebounce(keyword, 300);

  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(searchTarget === 'club' ? 35 : 0, { duration: 250 }),
    opacity: withTiming(searchTarget === 'club' ? 1 : 0, { duration: 250 }),
  }));

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View
        style={[
          styles.container,
          searchTarget === 'hashtag' && selectedHashtag === ''
            ? { backgroundColor: COLORS.white }
            : { backgroundColor: COLORS.background },
        ]}
      >
        {/* 상단 검색창 영역 */}
        <View style={[styles.header, searchTarget !== 'hashtag' || selectedHashtag !== '' ? styles.headerShadow : {}]}>
          <TextInput
            placeholder="검색"
            value={keyword}
            onChangeText={setKeyword}
            onFocus={() => setSelectedHashtag('')}
            placeholderTextColor={COLORS.gray2}
            style={styles.searchInput}
          />

          {/* 탭 전환 버튼 */}
          <View style={styles.tabRow}>
            {[
              { label: '피드', value: 'feed', width: 52 },
              { label: '동아리', value: 'club', width: 52 },
              { label: '해시태그', value: 'hashtag', width: 60 },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.value}
                style={[
                  styles.tabButton,
                  {
                    width: tab.width,
                    borderBottomColor: searchTarget === tab.value ? COLORS.primary : COLORS.white,
                  },
                ]}
                onPress={() => {
                  setKeyword('');
                  setSelectedHashtag('');
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  setSearchTarget(tab.value as any);
                }}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: searchTarget === tab.value ? COLORS.black : COLORS.gray2,
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* club일 때만 펼쳐지는 필터 */}
          <Animated.View style={[animatedStyle, styles.animatedContainer]}>
            <View style={styles.filterRow}>
              <FilterList />
              <TouchableOpacity onPress={() => setIsDetailSearchModalOpen(true)}>
                <AdjustmentsIcon />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>

        {/* 본문 영역 */}

        {searchTarget === 'feed' && <FeedSection keyword={debouncedKeyword} />}
        {searchTarget === 'club' && (
          <ClubSection
            keyword={debouncedKeyword}
            isDetailSearchModalOpen={isDetailSearchModalOpen}
            setIsDetailSearchModalOpen={setIsDetailSearchModalOpen}
          />
        )}
        {searchTarget === 'hashtag' && <HashtagSection keyword={debouncedKeyword} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingTop: 19,
  },
  headerShadow: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.16)',
    // TODO: android shadow
    elevation: 20,
  },
  searchInput: {
    height: 39,
    borderRadius: 10,
    backgroundColor: COLORS.gray0,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: 'PretendardRegular',
    color: COLORS.black,
  },
  tabRow: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 12,
    gap: 14,
  },
  tabButton: {
    height: 29,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
  },
  tabText: {
    fontFamily: 'PretendardBold',
    fontSize: 16,
  },
  animatedContainer: {
    overflow: 'hidden',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingBottom: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
});

export default ExploreScreen;
