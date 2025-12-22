import { View, StyleSheet } from 'react-native';

import COLORS from '@/constants/colors';
import { MessageType } from '@/types/MessageType';
import RegularText from '../common/RegularText';

function SystemMessage({
  message,
  index,
  boundaryIndex,
  boundaryMessageRef,
}: {
  message: MessageType;
  index: number;
  boundaryIndex: number;
  boundaryMessageRef: React.RefObject<View | null>;
}) {
  const { group_messages: groupMessages } = message as { group_messages: MessageType[] };
  const metadataType = groupMessages[0].metadata?.type;
  const userNames = groupMessages
    .map((m: MessageType) => m.metadata?.user_name || m.metadata?.user_names?.[0] || '알 수 없음')
    .filter((name: string) => name !== '알 수 없음');

  let content = '';
  if (metadataType === 'user_joined') {
    content = `${userNames.join('님, ')}님이 들어왔습니다.`;
  } else if (metadataType === 'user_left') {
    content = `${userNames.join('님, ')}님이 나갔습니다.`;
  } else if (metadataType === 'user_on_leave') {
    content = `${userNames.join('님, ')}님이 휴학했습니다.`;
  } else if (metadataType === 'user_graduated') {
    content = `${userNames.join('님, ')}님이 졸업했습니다.`;
  } else {
    // 기본값 (첫 번째 메시지의 content 사용)
    content = groupMessages[0].content || '';
  }

  return (
    <View ref={index === boundaryIndex ? boundaryMessageRef : null} style={styles.SystemMessage}>
      <RegularText fontSize={14} style={{ color: COLORS.white }}>
        {content}
      </RegularText>
    </View>
  );
}

const styles = StyleSheet.create({
  SystemMessage: {
    marginHorizontal: 'auto',
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.gray3,
    borderRadius: 16,
    opacity: 0.6,
    width: 'auto',
    maxWidth: '100%',
  },
});

export default SystemMessage;
