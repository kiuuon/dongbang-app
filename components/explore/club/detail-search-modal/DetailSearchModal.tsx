import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { fetchUniversityList } from '@/apis/user';
import COLORS from '@/constants/colors';
import { ERROR_MESSAGE } from '@/constants/error';
import filtersStore from '@/stores/filterStore';
import BoldText from '@/components/common/SemiBoldText';
import AffiliationSection from './AffiliationSection';
import CategorySection from './CategorySection';

interface DetailSearchModalProps {
  setIsDetailSearchModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DetailSearchModal({ setIsDetailSearchModalOpen }: DetailSearchModalProps) {
  const [tab, setTab] = useState<'소속' | '분야'>('소속');
  const { reset, apply, discard, draftFilters } = filtersStore();

  const { data: universityList } = useQuery({
    queryKey: ['universityList'],
    queryFn: fetchUniversityList,
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.UNIVERSITY.LIST_FETCH_FAILED, error.message);
      return false;
    },
  });

  useEffect(() => {
    discard();
  }, [discard]);

  return (
    <View style={styles.container}>
      <BoldText fontSize={16} style={{ marginTop: 16, marginBottom: 23 }}>
        상세 설정
      </BoldText>
      <View style={styles.mainContainer}>
        <View style={styles.tabs}>
          <TouchableOpacity
            onPress={() => setTab('소속')}
            style={[
              styles.tabButton,
              tab === '소속' ? { backgroundColor: COLORS.white } : { backgroundColor: COLORS.background },
            ]}
          >
            <BoldText fontSize={16} style={{ marginLeft: 32, color: tab === '소속' ? COLORS.black : COLORS.gray2 }}>
              소속
            </BoldText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab('분야')}
            style={[
              styles.tabButton,
              tab === '분야' ? { backgroundColor: COLORS.white } : { backgroundColor: COLORS.background },
            ]}
          >
            <BoldText fontSize={16} style={{ marginLeft: 32, color: tab === '분야' ? COLORS.black : COLORS.gray2 }}>
              분야
            </BoldText>
          </TouchableOpacity>
        </View>
        <View>
          {tab === '소속' && <AffiliationSection />}
          {tab === '분야' && <CategorySection />}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={reset} style={styles.resetButton}>
          <BoldText fontSize={16}>전체 초기화</BoldText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (!universityList?.some((u) => u.name === draftFilters.universityName)) {
              draftFilters.universityName = null;
            }
            apply();
            setIsDetailSearchModalOpen(false);
          }}
          style={styles.applyButton}
        >
          <BoldText fontSize={16} style={{ color: COLORS.white }}>
            적용하기
          </BoldText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  mainContainer: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    height: 500,
  },
  tabs: {
    flexDirection: 'column',
    width: 118,
    height: '100%',
    backgroundColor: COLORS.background,
  },
  tabButton: {
    justifyContent: 'center',
    height: 51,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 48,
    width: '100%',
    height: 94,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
  },
  resetButton: {
    width: 101,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButton: {
    width: 173,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 15,
  },
});
