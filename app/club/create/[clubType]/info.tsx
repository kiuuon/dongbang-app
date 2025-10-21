import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import CustomWebView from '@/components/common/CustomWebView';
import COLORS from '@/constants/colors';
import clubInfoStore from '@/stores/clubInfoStore';

function ClubInfoScreen() {
  const { clubType } = useLocalSearchParams();
  const setClubCampusType = clubInfoStore((state) => state.setCampusClubType);
  const setName = clubInfoStore((state) => state.setName);
  const setCategory = clubInfoStore((state) => state.setCategory);
  const setLocation = clubInfoStore((state) => state.setLocation);
  const setDescription = clubInfoStore((state) => state.setDescription);
  const setTags = clubInfoStore((state) => state.setTags);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/club/create/${clubType}/info` }}
        onMessage={(event) => {
          const { campusClubType, name, category, location, description, tags } = JSON.parse(event.nativeEvent.data);
          setClubCampusType(campusClubType);
          setName(name);
          setCategory(category);
          setLocation(location);
          setDescription(description);
          setTags(tags);
          router.push(`/club/create/${clubType}/detail`);
        }}
      />
    </SafeAreaView>
  );
}

export default ClubInfoScreen;
