import { useState } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';

import BoldText from '@/components/common/SemiBoldText';
import CustomWebView from '@/components/common/CustomWebView';
import CustomBottomSheet from '@/components/common/CustomBottomSheet';
import Colors from '@/constants/colors';

function FeedScreen() {
  const { clubType } = useLocalSearchParams();
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  const goToSelectedClubType = (selectedClubType: string) => {
    router.push(`/feed/${selectedClubType}`);
    setIsNavigationOpen(false);
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: Colors.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/feed/${clubType}` }}
        onMessage={(event) => {
          if (event.nativeEvent.data === 'openNavigation') {
            setIsNavigationOpen(true);
          }
        }}
      />
      <CustomBottomSheet isOpen={isNavigationOpen} onClose={() => setIsNavigationOpen(false)}>
        <View style={{ width: '100%', height: 306 }}>
          {clubType !== 'my' && (
            <TouchableOpacity style={styles.modalButton} onPress={() => goToSelectedClubType('my')}>
              <BoldText fontSize={16}>내 동아리</BoldText>
            </TouchableOpacity>
          )}
          {clubType !== 'campus' && (
            <TouchableOpacity style={styles.modalButton} onPress={() => goToSelectedClubType('campus')}>
              <BoldText fontSize={16}>교내 동아리</BoldText>
            </TouchableOpacity>
          )}
          {clubType !== 'union' && (
            <TouchableOpacity style={styles.modalButton} onPress={() => goToSelectedClubType('union')}>
              <BoldText fontSize={16}>연합 동아리</BoldText>
            </TouchableOpacity>
          )}
        </View>
      </CustomBottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalButton: {
    width: '100%',
    paddingVertical: 24,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray0,
  },
});

export default FeedScreen;
