import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import { writeFeed } from '@/apis/feed';
import CustomWebView from '@/components/common/CustomWebView';
import TagModal from '@/components/feed/write/TagModal/TagModal';
import Colors from '@/constants/colors';

function FeedWriteScreen() {
  const { clubId } = useLocalSearchParams();
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedClubs, setSelectedClubs] = useState<string[]>([]);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <CustomWebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEB_URL}/feed/write/${clubId}` }}
        onMessage={async (event) => {
          if (event.nativeEvent.data === 'open tag modal') {
            setIsTagModalOpen(true);
          } else {
            const { photos, title, content, isNicknameVisible, isPrivate } = JSON.parse(event.nativeEvent.data);
            writeFeed(
              photos,
              title,
              content,
              isNicknameVisible,
              isPrivate,
              clubId as string,
              selectedMembers,
              selectedClubs,
            );
            router.replace(`/club/${clubId}`);
          }
        }}
      />
      {isTagModalOpen && (
        <TagModal
          visible={isTagModalOpen}
          onClose={() => setIsTagModalOpen(false)}
          selectedMembers={selectedMembers}
          setSelectedMembers={setSelectedMembers}
          selectedClubs={selectedClubs}
          setSelectedClubs={setSelectedClubs}
        />
      )}
    </SafeAreaView>
  );
}

export default FeedWriteScreen;
