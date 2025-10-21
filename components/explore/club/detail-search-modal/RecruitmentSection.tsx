import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import COLORS from '@/constants/colors';
import filtersStore from '@/stores/filterStore';
import BottomArrowIcon from '@/icons/BottomArrowIcon';
import RegularText from '@/components/common/RegularText';
import BoldText from '@/components/common/SemiBoldText';

type EndDateOption = 'D-Day' | '7일 이내' | '15일 이내' | '30일 이내' | '장기 모집' | null;
const END_DATES: EndDateOption[] = ['D-Day', '7일 이내', '15일 이내', '30일 이내', '장기 모집'];

export default function RecruitmentSection() {
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [isEndDateDropdownOpen, setIsEndDateDropdownOpen] = useState(false);
  const { draftFilters, draftPatch, draftToggle } = filtersStore();

  return (
    <ScrollView style={styles.container}>
      {/* 모집 상태 */}
      <View>
        <BoldText fontSize={14} style={styles.label}>
          모집 상태
        </BoldText>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.dropdownButton}
          onPress={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
        >
          <RegularText fontSize={12}>
            {draftFilters.recruitmentStatuses?.length === 0 && '전체'}
            {(draftFilters.recruitmentStatuses?.length as number) < 3 &&
              (draftFilters.recruitmentStatuses?.includes('open') ||
                draftFilters.recruitmentStatuses?.includes('always')) &&
              '모집중'}
            {draftFilters.recruitmentStatuses?.length === 1 &&
              draftFilters.recruitmentStatuses[0] === 'closed' &&
              '모집 완료'}
          </RegularText>
          <BottomArrowIcon />
        </TouchableOpacity>

        {isStateDropdownOpen && (
          <View style={styles.dropdown}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                draftToggle('recruitmentStatuses', '__CLEAR__');
                draftPatch('endDateOption', null);
                setIsStateDropdownOpen(false);
              }}
            >
              <RegularText fontSize={12}>전체</RegularText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                if (!draftFilters.recruitmentStatuses?.includes('open')) draftToggle('recruitmentStatuses', 'open');
                if (!draftFilters.recruitmentStatuses?.includes('always')) draftToggle('recruitmentStatuses', 'always');
                if (draftFilters.recruitmentStatuses?.includes('closed')) draftToggle('recruitmentStatuses', 'closed');
                draftPatch('endDateOption', null);
                setIsStateDropdownOpen(false);
              }}
            >
              <RegularText fontSize={12}>모집중</RegularText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                if (draftFilters.recruitmentStatuses?.includes('open')) draftToggle('recruitmentStatuses', 'open');
                if (draftFilters.recruitmentStatuses?.includes('always')) draftToggle('recruitmentStatuses', 'always');
                if (!draftFilters.recruitmentStatuses?.includes('closed')) draftToggle('recruitmentStatuses', 'closed');
                draftPatch('endDateOption', null);
                setIsStateDropdownOpen(false);
              }}
            >
              <RegularText fontSize={12}>모집 완료</RegularText>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 마감일 */}
      {(draftFilters.recruitmentStatuses?.length as number) < 3 &&
        (draftFilters.recruitmentStatuses?.includes('open') ||
          draftFilters.recruitmentStatuses?.includes('always')) && (
          <View style={{ marginTop: 16 }}>
            <BoldText fontSize={14} style={styles.label}>
              마감일
            </BoldText>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.dropdownButton}
              onPress={() => setIsEndDateDropdownOpen(!isEndDateDropdownOpen)}
            >
              <RegularText fontSize={12}>
                {draftFilters.recruitmentStatuses?.includes('open') &&
                  draftFilters.recruitmentStatuses?.includes('always') &&
                  '전체'}
                {draftFilters.recruitmentStatuses?.includes('open') &&
                  !draftFilters.recruitmentStatuses?.includes('always') &&
                  draftFilters.endDateOption}
                {!draftFilters.recruitmentStatuses?.includes('open') &&
                  draftFilters.recruitmentStatuses?.includes('always') &&
                  '상시 모집'}
              </RegularText>
              <BottomArrowIcon />
            </TouchableOpacity>

            {isEndDateDropdownOpen && (
              <View style={styles.dropdown}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    if (!draftFilters.recruitmentStatuses?.includes('open')) draftToggle('recruitmentStatuses', 'open');
                    if (!draftFilters.recruitmentStatuses?.includes('always'))
                      draftToggle('recruitmentStatuses', 'always');
                    setIsEndDateDropdownOpen(false);
                  }}
                >
                  <RegularText fontSize={12}>전체</RegularText>
                </TouchableOpacity>

                {END_DATES.map((endDate) => (
                  <TouchableOpacity
                    key={endDate}
                    style={styles.dropdownItem}
                    onPress={() => {
                      if (!draftFilters.recruitmentStatuses?.includes('open'))
                        draftToggle('recruitmentStatuses', 'open');
                      if (draftFilters.recruitmentStatuses?.includes('always'))
                        draftToggle('recruitmentStatuses', 'always');
                      draftPatch('endDateOption', endDate);
                      setIsEndDateDropdownOpen(false);
                    }}
                  >
                    <RegularText fontSize={12}>{endDate}</RegularText>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    if (draftFilters.recruitmentStatuses?.includes('open')) draftToggle('recruitmentStatuses', 'open');
                    if (!draftFilters.recruitmentStatuses?.includes('always'))
                      draftToggle('recruitmentStatuses', 'always');
                    setIsEndDateDropdownOpen(false);
                  }}
                >
                  <RegularText fontSize={12}>상시 모집</RegularText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 30,
    paddingTop: 30,
  },
  label: {
    marginBottom: 10,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 32,
    width: 162,
    borderWidth: 1,
    borderColor: COLORS.gray0,
    borderRadius: 8,
    paddingLeft: 8,
    paddingRight: 14,
    backgroundColor: COLORS.white,
  },
  dropdown: {
    position: 'absolute',
    top: 68,
    zIndex: 10,
    maxHeight: 240,
    width: 162,
    borderWidth: 1,
    borderColor: COLORS.gray0,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
});
