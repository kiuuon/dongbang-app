/* eslint-disable react/no-array-index-key */
import { Alert, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { fetchUserListByNicknames } from '@/apis/user';
import { ERROR_MESSAGE } from '@/constants/error';
import COLORS from '@/constants/colors';
import RegularText from '@/components/common/RegularText';

interface User {
  id: string;
  nickname: string;
  name: string;
}

function MentionRenderer({ text }: { text: string }) {
  const matches = text.match(/@[\w가-힣]+/g) || [];
  const nicknames = [...new Set(matches.map((m) => m.substring(1)))];

  const { data: mentionedUsers } = useQuery({
    queryKey: ['mentionedUsers', nicknames],
    enabled: nicknames.length > 0,
    queryFn: () => fetchUserListByNicknames(nicknames),
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.USER.LIST_FETCH_FAILED, error.message);
      return false;
    },
  });

  const userMap = Object.fromEntries((mentionedUsers as User[])?.map((u) => [u.nickname, u]) || []);

  const parts = text.split(/(@[\w가-힣]+)|(\n)/g).filter(Boolean);

  const handleMentionPress = (user: User) => {
    router.push(`/profile/${user.nickname}`);
  };

  return (
    <View style={styles.container}>
      {parts.map((part, index) => {
        if (part === '\n') {
          return <Text key={index}>{'\n'}</Text>;
        }

        if (part.startsWith('@') && part.length > 1) {
          const nickname = part.substring(1);
          const user = userMap[nickname];

          if (!user) {
            return (
              <RegularText key={index} fontSize={14}>
                {part}
              </RegularText>
            );
          }

          return (
            <TouchableOpacity key={index} activeOpacity={0.7} onPress={() => handleMentionPress(user)}>
              <RegularText fontSize={14} style={styles.mentionText}>
                {user.name}
              </RegularText>
            </TouchableOpacity>
          );
        }

        return (
          <RegularText key={index} fontSize={14}>
            {part}
          </RegularText>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  mentionText: {
    color: COLORS.tertiary,
    backgroundColor: COLORS.secondary_light,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
});

export default MentionRenderer;
