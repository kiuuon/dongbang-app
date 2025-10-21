import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation } from '@tanstack/react-query';

import CustomWebView from '@/components/common/CustomWebView';
import { ClubType } from '@/types/ClubType';
import COLORS from '@/constants/colors';
import clubInfoStore from '@/stores/clubInfoStore';
import { createClub } from '@/apis/club';

function ClubDetailScreen() {
  const { clubType } = useLocalSearchParams();

  const clubCampusType = clubInfoStore((state) => state.campusClubType);
  const name = clubInfoStore((state) => state.name);
  const category = clubInfoStore((state) => state.category);
  const location = clubInfoStore((state) => state.location);
  const description = clubInfoStore((state) => state.description);
  const tags = clubInfoStore((state) => state.tags);

  const { mutate: createClubMutation } = useMutation({
    mutationFn: (body: ClubType) => createClub(body),
    onSuccess: () => {
      router.push('/club');
    },
    onError: (error) => {
      Alert.alert('동아리 개설에 실패했습니다. 다시 시도해주세요.', error.message);
      router.back();
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/club/create/${clubType}/detail` }}
        onMessage={async (data) => {
          const { type, action, payload } = data;

          if (type === 'event') {
            if (action === 'create club') {
              const body = {
                ...payload,
                detail_type: clubCampusType,
                name,
                category,
                location,
                description,
                tags,
              };

              createClubMutation(body);
            }
          }
        }}
      />
    </SafeAreaView>
  );
}

export default ClubDetailScreen;
