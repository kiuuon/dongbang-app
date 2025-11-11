import { useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import type { WebView as WebViewType } from 'react-native-webview';

import { editClubInfo } from '@/apis/club';
import COLORS from '@/constants/colors';
import { ERROR_MESSAGE } from '@/constants/error';
import { ClubType } from '@/types/ClubType';
import clubInfoStore from '@/stores/clubInfoStore';
import CustomWebView from '@/components/common/CustomWebView';

function ClubDetailScreen() {
  const { clubId } = useLocalSearchParams();

  const clubCampusType = clubInfoStore((state) => state.campusClubType);
  const name = clubInfoStore((state) => state.name);
  const category = clubInfoStore((state) => state.category);
  const location = clubInfoStore((state) => state.location);
  const bio = clubInfoStore((state) => state.bio);
  const description = clubInfoStore((state) => state.description);
  const tags = clubInfoStore((state) => state.tags);

  const webViewRef = useRef<WebViewType | null>(null);

  const { mutate: editClubMutation } = useMutation({
    mutationFn: (body: ClubType) => editClubInfo(body, clubId as string),
    onSuccess: () => {
      router.back();
    },
    onError: (error) => {
      Alert.alert(ERROR_MESSAGE.CLUB.EDIT_FAILED, error.message);
      router.back();
    },
  });

  const handleLoadEnd = () => {
    webViewRef.current?.postMessage(
      JSON.stringify({
        type: 'event',
        action: 'set club detail in create/edit club page',
        payload: { clubCampusType, name, category, location, bio, description, tags },
      }),
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CustomWebView
        ref={webViewRef}
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/club/${clubId}/edit/detail` }}
        onLoadEnd={handleLoadEnd}
        onMessage={(data) => {
          const { type, action, payload } = data;

          if (type === 'event') {
            if (action === 'edit club') {
              const body = {
                ...payload,
                detail_type: clubCampusType,
                name,
                category,
                location,
                bio,
                description,
              };

              editClubMutation(body);
            }
          }
        }}
      />
    </SafeAreaView>
  );
}

export default ClubDetailScreen;
