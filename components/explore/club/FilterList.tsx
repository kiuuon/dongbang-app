import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import filtersStore from '@/stores/filterStore';
import FilterItem from './FilterItem';

export default function FilterList() {
  const { filters, patch, toggle } = filtersStore();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
      {filters.clubType && (
        <FilterItem
          label={filters.clubType === 'campus' ? '교내' : '연합'}
          onRemove={() => {
            patch('clubType', null);
            patch('universityName', null);
            patch('location', null);
            toggle('detailTypes', '__CLEAR__');
          }}
        />
      )}

      {filters.universityName && (
        <FilterItem label={filters.universityName} onRemove={() => patch('universityName', null)} />
      )}

      {filters.detailTypes?.map((dt) => (
        <FilterItem key={dt} label={dt} onRemove={() => toggle('detailTypes', dt)} />
      ))}

      {filters.location && <FilterItem label={filters.location} onRemove={() => patch('location', null)} />}

      {filters.categories?.map((category) => (
        <FilterItem key={category} label={category} onRemove={() => toggle('categories', category)} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingRight: 8,
  },
});
