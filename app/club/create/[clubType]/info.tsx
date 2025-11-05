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
  const setBio = clubInfoStore((state) => state.setBio);
  const setTags = clubInfoStore((state) => state.setTags);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/club/create/${clubType}/info` }}
        onMessage={(data) => {
          const { type, action, payload } = data;
          if (type === 'event') {
            if (action === 'complete info form') {
              const { campusClubType, name, category, location, bio, description, tags } = payload;
              setClubCampusType(campusClubType);
              setName(name);
              setCategory(category);
              setLocation(location);
              setBio(bio);
              setDescription(description);
              setTags(tags);

              router.push(`/club/create/${clubType}/detail`);
            }
          }
        }}
      />
    </SafeAreaView>
  );
}

export default ClubInfoScreen;
