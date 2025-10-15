import { View, StyleSheet, TouchableOpacity } from 'react-native';

import Colors from '@/constants/colors';
import LockIcon from '@/icons/LockIcon';
import InteractIcon2 from '@/icons/InteractIcon2';
import BoldText from '@/components/common/SemiBoldText';

function InteractModal() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, styles.bottomBorder]}>
        <InteractIcon2 />
        <BoldText fontSize={16}>교류 신청</BoldText>
      </TouchableOpacity>
      <View style={[styles.button, styles.bottomBorder]}>
        <LockIcon />
        <BoldText fontSize={16} style={{ color: Colors.gray1 }}>
          지원하기
        </BoldText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 24,
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray0,
  },
});

export default InteractModal;
