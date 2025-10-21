import { useState } from 'react';
import { TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { fetchMyClubs } from '@/apis/club';
import BoldText from '@/components/common/SemiBoldText';
import CustomWebView from '@/components/common/CustomWebView';
import CustomBottomSheet from '@/components/common/CustomBottomSheet';
import COLORS from '@/constants/colors';

function ClubScreen() {
  const { clubId } = useLocalSearchParams();
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const { data: myClubs } = useQuery({
    queryKey: ['myClubs'],
    queryFn: fetchMyClubs,
    throwOnError: (error) => {
      Alert.alert('동아리 목록을 불러오는 데 실패했습니다. 다시 시도해주세요.', error.message);
      return false;
    },
  });

  const goToSelectedClub = (selectedClubId: string) => {
    router.replace(`/club/${selectedClubId}`);
    setIsNavigationOpen(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/club/${clubId}` }}
        onMessage={(data) => {
          const { type, action } = data;
          if (type === 'event') {
            if (action === 'open navigation') {
              setIsNavigationOpen(true);
            } else if (action === 'go to coming soon page') {
              router.push('/coming-soon');
            } else if (action === 'go to write feed page') {
              router.push(`/feed/write/${clubId}`);
            } else if (action === 'go to recruit page') {
              router.push(`/club/${clubId}/recruit`);
            }
          }
        }}
      />
      <CustomBottomSheet
        isOpen={isNavigationOpen}
        onClose={() => setIsNavigationOpen(false)}
        scrollable={(myClubs?.length as number) > 4 && true}
        height={(myClubs?.length as number) > 4 ? 350 : -1}
        scrollViewHeight={(myClubs?.length as number) > 4 ? 290 : '100%'}
      >
        {myClubs?.map(
          (club, index) =>
            club.id !== clubId && (
              <TouchableOpacity
                key={club.id}
                style={[
                  styles.modalButton,
                  myClubs.length - 1 > index && {
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.gray0,
                  },
                ]}
                onPress={() => goToSelectedClub(club.id)}
              >
                <Image source={{ uri: club.logo }} style={styles.clubImage} />
                <BoldText fontSize={16}>{club.name}</BoldText>
              </TouchableOpacity>
            ),
        )}
      </CustomBottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 24,
    paddingVertical: 24,
    marginHorizontal: 20,
  },
  clubImage: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.background,
    borderRadius: 25,
  },
});

export default ClubScreen;
