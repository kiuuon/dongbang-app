import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { fetchUniversityList } from '@/apis/user';
import COLORS from '@/constants/colors';
import { ERROR_MESSAGE } from '@/constants/error';
import filtersStore from '@/stores/filterStore';
import BottomArrowIcon from '@/icons/BottomArrowIcon';
import RegularText from '@/components/common/RegularText';

const LOCATIONS = [
  '전국',
  '서울',
  '경기',
  '인천',
  '강원',
  '충북',
  '충남',
  '대전',
  '세종',
  '전북',
  '전남',
  '광주',
  '경북',
  '경남',
  '대구',
  '부산',
  '울산',
  '제주',
];

export default function AffiliationSection() {
  const [searchedUniversityList, setSearchedUniversityList] = useState<{ id: number; name: string }[]>([]);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const { draftFilters, draftPatch, draftToggle } = filtersStore();

  const { data: universityList } = useQuery({
    queryKey: ['universityList'],
    queryFn: fetchUniversityList,
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.UNIVERSITY.LIST_FETCH_FAILED, error.message);
      return false;
    },
  });

  const handleUniversity = (text: string) => {
    draftPatch('universityName', text);

    if (!universityList) return;

    if (text === '') {
      setSearchedUniversityList([]);
    } else {
      const searchedList = universityList.filter((item) => item.name.includes(text));
      setSearchedUniversityList(searchedList);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* 유형 선택 */}
      <View>
        <Text style={styles.sectionTitle}>유형</Text>
        <View style={styles.row}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.typeButton, draftFilters.clubType === 'campus' && styles.typeButtonActive]}
            onPress={() => {
              if (draftFilters.clubType === 'campus') {
                draftPatch('clubType', null);
                draftPatch('universityName', null);
                setSearchedUniversityList([]);
                draftToggle('detailTypes', '__CLEAR__');
                return;
              }
              draftPatch('clubType', 'campus');
              draftPatch('location', null);
            }}
          >
            <Text style={[styles.typeText, draftFilters.clubType === 'campus' && styles.activeText]}>교내</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.typeButton, draftFilters.clubType === 'union' && styles.typeButtonActive]}
            onPress={() => {
              if (draftFilters.clubType === 'union') {
                draftPatch('clubType', null);
                draftPatch('location', null);
                return;
              }
              draftPatch('clubType', 'union');
              draftPatch('universityName', null);
              setSearchedUniversityList([]);
              draftToggle('detailTypes', '__CLEAR__');
            }}
          >
            <Text style={[styles.typeText, draftFilters.clubType === 'union' && styles.activeText]}>연합</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 교내 - 대학 검색 */}
      {draftFilters.clubType === 'campus' && (
        <View style={{ marginTop: 16 }}>
          <Text style={styles.sectionTitle}>소속대학</Text>
          <TextInput
            value={draftFilters.universityName || ''}
            onChangeText={handleUniversity}
            placeholder="학교 이름 입력"
            placeholderTextColor={COLORS.gray2}
            style={styles.input}
          />

          {searchedUniversityList.length > 0 && (
            <View style={styles.dropdown}>
              {searchedUniversityList.map((univ) => (
                <TouchableOpacity
                  key={univ.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    draftPatch('universityName', univ.name);
                    setSearchedUniversityList([]);
                  }}
                >
                  <RegularText fontSize={12}>{univ.name}</RegularText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      {/* 교내 - 종류 */}
      {draftFilters.clubType === 'campus' && (
        <View style={{ marginTop: 16 }}>
          <Text style={styles.sectionTitle}>종류</Text>
          <View style={styles.rowWrap}>
            {['총 동아리', '중앙 동아리', '단과대 동아리', '과 동아리', '소모임'].map((type) => (
              <TouchableOpacity
                key={type}
                activeOpacity={0.7}
                style={[styles.detailButton, draftFilters.detailTypes?.includes(type) && styles.detailButtonActive]}
                onPress={() => draftToggle('detailTypes', type)}
              >
                <Text style={[styles.detailText, draftFilters.detailTypes?.includes(type) && styles.activeText]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* 연합 - 활동 위치 */}
      {draftFilters.clubType === 'union' && (
        <View style={{ marginTop: 16 }}>
          <Text style={styles.sectionTitle}>활동위치</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.dropdownButton}
            onPress={() => setIsLocationDropdownOpen(true)}
          >
            <Text style={styles.dropdownButtonText}>{draftFilters.location || '전체'}</Text>
            <BottomArrowIcon />
          </TouchableOpacity>

          {isLocationDropdownOpen && (
            <View style={styles.dropdown}>
              <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    draftPatch('location', null);
                    setIsLocationDropdownOpen(false);
                  }}
                >
                  <RegularText fontSize={12}>전체</RegularText>
                </TouchableOpacity>

                {LOCATIONS.map((loc) => (
                  <TouchableOpacity
                    key={loc}
                    style={styles.dropdownItem}
                    onPress={() => {
                      draftPatch('location', loc);
                      setIsLocationDropdownOpen(false);
                    }}
                  >
                    <RegularText fontSize={12}>{loc}</RegularText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
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
    backgroundColor: COLORS.white,
  },
  sectionTitle: {
    fontFamily: 'PretendardBold',
    fontSize: 14,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  typeButton: {
    height: 32,
    width: 47,
    borderRadius: 16,
    backgroundColor: COLORS.gray0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  typeText: {
    fontFamily: 'PretendardRegular',
    fontSize: 12,
    color: COLORS.black,
  },
  activeText: {
    color: COLORS.white,
  },
  input: {
    height: 32,
    width: 162,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray0,
    paddingHorizontal: 9,
    fontSize: 12,
    fontFamily: 'PretendardRegular',
  },
  dropdown: {
    marginTop: 4,
    maxHeight: 224,
    width: 162,
    borderWidth: 1,
    borderColor: COLORS.gray0,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  dropdownItem: {
    padding: 8,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  detailButton: {
    height: 32,
    borderRadius: 24,
    backgroundColor: COLORS.gray0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 3,
  },
  detailButtonActive: {
    backgroundColor: COLORS.primary,
  },
  detailText: {
    fontFamily: 'PretendardRegular',
    fontSize: 12,
    color: COLORS.black,
  },
  dropdownButton: {
    height: 32,
    width: 162,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 8,
    paddingRight: 14,
  },
  dropdownButtonText: {
    fontSize: 12,
    color: COLORS.black,
  },
});
