import { useState } from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { fetchMyClubs } from '@/apis/club';
import BoldText from '@/components/common/SemiBoldText';
import CustomWebView from '@/components/common/CustomWebView';
import CustomBottomSheet from '@/components/common/CustomBottomSheet';
import Colors from '@/constants/colors';

function ClubScreen() {
  const { clubId } = useLocalSearchParams();
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const { data: myClubs } = useQuery({
    queryKey: ['myClubs'],
    queryFn: fetchMyClubs,
  });

  const goToSelectedClub = (selectedClubId: string) => {
    router.replace(`/club/${selectedClubId}`);
    setIsNavigationOpen(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/club/${clubId}` }}
        onMessage={(event) => {
          if (event.nativeEvent.data === 'openNavigation') {
            setIsNavigationOpen(true);
          } else if (event.nativeEvent.data === 'comingSoon') {
            router.push('/coming-soon');
          } else if (event.nativeEvent.data === 'go to write feed page') {
            router.push(`/feed/write/${clubId}`);
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
                    borderBottomColor: Colors.gray0,
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
  },
  clubImage: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.background,
    borderRadius: 25,
  },
});

export default ClubScreen;
