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

      {(filters.recruitmentStatuses?.length as number) > 0 && (
        <FilterItem
          label={filters.recruitmentStatuses?.includes('closed') ? '모집 완료' : '모집중'}
          onRemove={() => {
            toggle('recruitmentStatuses', '__CLEAR__');
            patch('endDateOption', null);
          }}
        />
      )}

      {filters.endDateOption && (
        <FilterItem label={filters.endDateOption} onRemove={() => patch('endDateOption', null)} />
      )}

      {filters.meeting && <FilterItem label={filters.meeting} onRemove={() => patch('meeting', null)} />}

      {filters.duesOption && <FilterItem label={filters.duesOption} onRemove={() => patch('duesOption', null)} />}
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
