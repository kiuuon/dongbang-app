import { TouchableOpacity, View, StyleSheet, Alert, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { fetchChatRoomInfo } from '@/apis/chats';
import COLORS from '@/constants/colors';
import { ERROR_MESSAGE } from '@/constants/error';
import LeftArrowIcon from '@/icons/LeftArrowIcon';
import SearchIcon2 from '@/icons/SearchIcon2';
import MenuIcon from '@/icons/MenuIcon';
import BoldText from '../common/SemiBoldText';
import RegularText from '../common/RegularText';

function ChatRoomHeader() {
  const { chatRoomId } = useLocalSearchParams();

  const { data: chatRoomInfo } = useQuery({
    queryKey: ['chatRoomInfo', chatRoomId],
    queryFn: () => fetchChatRoomInfo(chatRoomId as string),
    enabled: !!chatRoomId,
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.CHATS.FETCH_ROOM_INFO_FAILED, error.message);
      return false;
    },
  });

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', left: 20 }}>
        <LeftArrowIcon color={COLORS.black} />
      </TouchableOpacity>
      <View style={styles.clubInfo}>
        <Image source={{ uri: chatRoomInfo?.club.logo }} style={styles.clubLogo} />
        <View>
          <BoldText fontSize={14}>{chatRoomInfo?.club.name}</BoldText>
          <RegularText fontSize={12} style={{ color: COLORS.gray1 }}>
            {chatRoomInfo?.members.length}명
          </RegularText>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity>
          <SearchIcon2 />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push(`/chats/${chatRoomId}/menu`)}>
          <MenuIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'sticky',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    height: 60,
    gap: 10,
  },
  clubInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  clubLogo: {
    width: 40,
    height: 40,
    borderRadius: 16,
  },
  buttonContainer: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
});

export default ChatRoomHeader;
