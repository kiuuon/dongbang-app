import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import XIcon from '@/icons/XIcon';
import COLORS from '@/constants/colors';

import RegularText from '@/components/common/RegularText';

interface FilterItemProps {
  label: string;
  onRemove: () => void;
}

export default function FilterItem({ label, onRemove }: FilterItemProps) {
  return (
    <View style={styles.container}>
      <RegularText fontSize={14} style={{ color: COLORS.gray2 }}>
        {label}
      </RegularText>
      <TouchableOpacity onPress={onRemove} activeOpacity={0.7}>
        <XIcon />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
});
