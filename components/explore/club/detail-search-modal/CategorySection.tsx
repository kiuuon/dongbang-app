import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

import Colors from '@/constants/colors';
import {
  SPORTS_CATEGORIES,
  ART_CATEGORIES,
  HOBBY_CATEGORIES,
  SOCIETY_CATEGORIES,
  ACADEMIC_CATEGORIES,
} from '@/constants/category';
import filtersStore from '@/stores/filterStore';
import RegularText from '@/components/common/RegularText';
import BoldText from '@/components/common/SemiBoldText';

export default function CategorySection() {
  const [selectedTopCategory, setSelectedTopCategory] = useState('');
  const { draftFilters, draftToggle } = filtersStore();

  const renderCategoryButtons = (categories: string[]) => (
    <View>
      {categories.map(
        (_, index) =>
          index % 3 === 0 && (
            // eslint-disable-next-line react/no-array-index-key
            <View key={index} style={styles.row}>
              {categories.slice(index, index + 3).map((category) => {
                const isSelected = draftFilters.categories?.includes(category);
                return (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      isSelected ? styles.categoryButtonSelected : styles.categoryButtonUnselected,
                    ]}
                    onPress={() => draftToggle('categories', category)}
                  >
                    <Text style={isSelected ? styles.categoryTextSelected : styles.categoryTextUnselected}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ),
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <BoldText fontSize={14} style={styles.sectionTitle}>
        카테고리
      </BoldText>

      {/* 상단 대분류 */}
      <View style={styles.row}>
        {['운동', '예술', '취미'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.topButton, { backgroundColor: selectedTopCategory === item ? Colors.white : Colors.gray0 }]}
            onPress={() => setSelectedTopCategory(selectedTopCategory === item ? '' : item)}
          >
            <RegularText fontSize={14} style={styles.grayText}>
              {item}
            </RegularText>
          </TouchableOpacity>
        ))}
      </View>

      {/* 중분류 */}
      {selectedTopCategory === '운동' && renderCategoryButtons(SPORTS_CATEGORIES)}
      {selectedTopCategory === '예술' && renderCategoryButtons(ART_CATEGORIES)}
      {selectedTopCategory === '취미' && renderCategoryButtons(HOBBY_CATEGORIES)}

      <View style={styles.row}>
        {['사회', '학술'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.topButton, { backgroundColor: selectedTopCategory === item ? Colors.white : Colors.gray0 }]}
            onPress={() => setSelectedTopCategory(selectedTopCategory === item ? '' : item)}
          >
            <RegularText fontSize={14} style={styles.grayText}>
              {item}
            </RegularText>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[
            styles.topButton,
            draftFilters.categories?.includes('기타') ? styles.categoryButtonSelected : styles.categoryButtonUnselected,
          ]}
          onPress={() => draftToggle('categories', '기타')}
        >
          <Text
            style={
              draftFilters.categories?.includes('기타') ? styles.categoryTextSelected : styles.categoryTextUnselected
            }
          >
            기타
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTopCategory === '사회' && renderCategoryButtons(SOCIETY_CATEGORIES)}
      {selectedTopCategory === '학술' && renderCategoryButtons(ACADEMIC_CATEGORIES)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 30,
    paddingTop: 30,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 13,
    marginBottom: 8,
  },
  topButton: {
    height: 31,
    width: 63,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grayText: {
    color: Colors.gray2,
  },
  categoryButton: {
    height: 31,
    width: 63,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryButtonSelected: {
    backgroundColor: Colors.primary,
  },
  categoryButtonUnselected: {
    backgroundColor: Colors.white,
  },
  categoryTextSelected: {
    color: Colors.white,
    fontFamily: 'PretendardBold',
    fontSize: 14,
  },
  categoryTextUnselected: {
    color: Colors.gray2,
    fontFamily: 'PretendardRegular',
    fontSize: 14,
  },
});
