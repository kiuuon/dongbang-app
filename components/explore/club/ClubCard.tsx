import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

import LockIcon from '@/icons/LockIcon';
import Colors from '@/constants/colors';
import { ClubType } from '@/types/ClubType';
import BoldText from '@/components/common/SemiBoldText';
import RegularText from '@/components/common/RegularText';

type RecruitmentStatus = 'open' | 'always' | 'closed';

interface ClubCardProps {
  club: ClubType;
  openClubCardId: string | null;
  setOpenClubCardId: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function ClubCard({ club, openClubCardId, setOpenClubCardId }: ClubCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const statusClasses: Record<RecruitmentStatus, any> = {
    open: { color: Colors.primary, fontFamily: 'PretendardBold', fontSize: 12 },
    always: { color: Colors.black, fontFamily: 'PretendardRegular', fontSize: 12 },
    closed: { color: Colors.gray1, fontFamily: 'PretendardRegular', fontSize: 12 },
  };

  const getDiffInDays = (endDate: string | Date): number => {
    const today = new Date();
    const end = new Date(endDate);

    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - today.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  let text: string;

  if (club.recruitment?.[0].recruitment_status === 'open' && club.recruitment?.[0].end_date) {
    const diff = getDiffInDays(club.recruitment?.[0].end_date);
    text = diff >= 0 ? `D - ${diff}` : '모집 종료';
  } else if (club.recruitment?.[0].recruitment_status === 'always') {
    text = '상시 모집';
  } else {
    text = '모집 종료';
  }

  const isOpen = openClubCardId === club.id;

  // ✅ 애니메이션 값
  const marginRight = useSharedValue(0);

  // ✅ 상태 변경 시 애니메이션 실행
  useEffect(() => {
    marginRight.value = withTiming(isOpen ? 56 : 0, {
      duration: 250,
      easing: Easing.out(Easing.quad),
    });
  }, [isOpen, marginRight]);

  // ✅ Animated Style
  const animatedCardStyle = useAnimatedStyle(() => ({
    marginRight: marginRight.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, animatedCardStyle]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={() => setOpenClubCardId(isOpen ? null : club.id)}
        >
          <Image source={{ uri: club.logo }} style={styles.logo} />

          <View style={styles.infoContainer}>
            <View style={styles.header}>
              <View style={styles.textGroup}>
                <BoldText fontSize={14} style={{ marginBottom: 6 }}>
                  {club.name}
                </BoldText>
                <RegularText fontSize={12} style={{ color: Colors.gray2 }}>
                  {club.description}
                </RegularText>
              </View>
              <Text style={statusClasses[club.recruitment?.[0].recruitment_status as RecruitmentStatus]}>{text}</Text>
            </View>

            <View style={styles.tagContainer}>
              {club.tags.slice(0, 3).map((tag) => (
                <View key={tag} style={styles.tag}>
                  <RegularText fontSize={12} style={{ color: Colors.gray2 }}>
                    {tag}
                  </RegularText>
                </View>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.rightButtons}>
        <TouchableOpacity activeOpacity={0.7} style={[styles.rightButton, isOpen && styles.activeButton]}>
          <RegularText fontSize={12} style={{ color: Colors.primary }}>
            소개
          </RegularText>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} style={[styles.rightButton, isOpen && styles.activeButton]}>
          {club.recruitment?.[0].recruitment_status === 'closed' ? (
            <LockIcon />
          ) : (
            <RegularText fontSize={12} style={{ color: Colors.primary }}>
              모집 공고
            </RegularText>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 9,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.background,
    marginRight: 20,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  textGroup: {
    flex: 1,
    marginRight: 10,
  },
  tagContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  tag: {
    backgroundColor: Colors.gray0,
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },

  rightButtons: {
    position: 'absolute',
    right: 0,
    flexDirection: 'column',
    gap: 7,
    width: 72,
  },
  rightButton: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 14,
    backgroundColor: Colors.white,
  },
  activeButton: {
    shadowColor: Colors.black,
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
});
