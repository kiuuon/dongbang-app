import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import CustomWebView from '@/components/common/CustomWebView';
import Colors from '@/constants/colors';
import clubInfoStore from '@/stores/club-info-store';
import { createClub } from '@/apis/club';

function ClubDetailScreen() {
  const { clubType } = useLocalSearchParams();

  const clubCampusType = clubInfoStore((state) => state.campusClubType);
  const name = clubInfoStore((state) => state.name);
  const category = clubInfoStore((state) => state.category);
  const location = clubInfoStore((state) => state.location);
  const description = clubInfoStore((state) => state.description);
  const tags = clubInfoStore((state) => state.tags);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/club/create/${clubType}/detail` }}
        onMessage={async (event) => {
          const body = {
            ...JSON.parse(event.nativeEvent.data),
            detail_type: clubCampusType,
            name,
            category,
            location,
            description,
            tags,
          };

          await createClub(body);

          router.push('/club');
        }}
      />
    </SafeAreaView>
  );
}

export default ClubDetailScreen;
