import { View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import formatToTime from '@/utils/chat/formatToTime';
import COLORS from '@/constants/colors';
import { MessageType } from '@/types/MessageType';
import RegularText from '../common/RegularText';
import BoldText from '../common/SemiBoldText';
import TextMessageTail from './TextMessageTail';

// 검색 키워드 하이라이팅 함수 (앞에서부터 첫 번째 매칭만)
const highlightSearchKeyword = (text: string, keyword: string) => {
  if (!keyword.trim()) return text;

  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  const index = lowerText.indexOf(lowerKeyword);

  if (index === -1) return text;

  // 앞에서부터 첫 번째 매칭만 하이라이팅
  const before = text.slice(0, index);
  const matched = text.slice(index, index + keyword.length);
  const after = text.slice(index + keyword.length);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <RegularText fontSize={14}>{before}</RegularText>
      <View style={{ backgroundColor: COLORS.tertiary }}>
        <RegularText fontSize={14}>{matched}</RegularText>
      </View>
      <RegularText fontSize={14}>{after}</RegularText>
    </View>
  );
};

function TextMessage({
  message,
  messages,
  index,
  boundaryIndex,
  boundaryMessageRef,
  searchQuery,
}: {
  message: MessageType;
  messages: MessageType[];
  index: number;
  boundaryIndex: number;
  boundaryMessageRef: React.RefObject<View | null>;
  searchQuery: string;
}) {
  const router = useRouter();

  // 검색어가 있으면 하이라이팅된 텍스트, 없으면 원본 텍스트
  const displayContent = searchQuery.trim()
    ? highlightSearchKeyword(message.content || '', searchQuery)
    : message.content;

  if (message.isMine) {
    if (index === messages.length - 1 || messages[index + 1].sender_id !== message.sender_id) {
      return (
        <View
          ref={index === boundaryIndex ? boundaryMessageRef : null}
          style={{
            position: 'relative',
            marginBottom: 8,
            marginTop: 8,
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            gap: 4,
          }}
        >
          <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
            {message.unread_count && message.unread_count > 0 ? (
              <BoldText fontSize={10} style={{ color: COLORS.primary }}>
                {message.unread_count}
              </BoldText>
            ) : null}
            <RegularText fontSize={10}>{formatToTime(message.created_at)}</RegularText>
          </View>
          <View style={{ backgroundColor: COLORS.primary, borderRadius: 12, padding: 12 }}>
            <RegularText fontSize={14}>{displayContent}</RegularText>
          </View>

          <View style={{ position: 'absolute', right: -8, top: 3 }}>
            <TextMessageTail isMine={message.isMine} />
          </View>
        </View>
      );
    }

    return (
      <View
        ref={index === boundaryIndex ? boundaryMessageRef : null}
        style={{ marginBottom: 8, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', gap: 4 }}
      >
        <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
          {message.unread_count && message.unread_count > 0 ? (
            <BoldText fontSize={10} style={{ color: COLORS.primary }}>
              {message.unread_count}
            </BoldText>
          ) : null}
          <RegularText fontSize={10}>{formatToTime(message.created_at)}</RegularText>
        </View>
        <View style={{ backgroundColor: COLORS.primary, borderRadius: 12, padding: 12 }}>
          <RegularText fontSize={14}>{displayContent}</RegularText>
        </View>
      </View>
    );
  }

  if (index === messages.length - 1 || messages[index + 1].sender?.id !== message.sender?.id) {
    return (
      <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
        <TouchableOpacity
          onPress={() => {
            if (message.sender?.deleted_at) {
              return;
            }
            router.push(`/profile/${message.sender?.nickname}`);
          }}
        >
          <Image
            source={{ uri: message.sender?.avatar }}
            style={{ width: 32, height: 32, minWidth: 32, minHeight: 32, borderRadius: '50%', objectFit: 'cover' }}
          />
        </TouchableOpacity>
        <View>
          <BoldText
            fontSize={14}
            style={{ marginBottom: 4, color: message.sender?.deleted_at ? COLORS.gray2 : COLORS.black }}
          >
            {message.sender?.deleted_at ? '(알수없음)' : message.sender?.club_nickname}
          </BoldText>
          <View
            ref={index === boundaryIndex ? boundaryMessageRef : null}
            style={{ position: 'relative', marginBottom: 8, flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}
          >
            <View style={{ backgroundColor: COLORS.white, borderRadius: 12, padding: 12 }}>
              <RegularText fontSize={14}>{displayContent}</RegularText>
            </View>
            <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              {message.unread_count && message.unread_count > 0 ? (
                <BoldText fontSize={10} style={{ color: COLORS.primary }}>
                  {message.unread_count}
                </BoldText>
              ) : null}
              <RegularText fontSize={10}>{formatToTime(message.created_at)}</RegularText>
            </View>
            <View style={{ position: 'absolute', left: -8, top: 3 }}>
              <TextMessageTail isMine={message.isMine} />
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View
      ref={index === boundaryIndex ? boundaryMessageRef : null}
      style={{ marginBottom: 8, marginLeft: 40, flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}
    >
      <View style={{ backgroundColor: COLORS.white, borderRadius: 12, padding: 12 }}>
        <RegularText fontSize={14}>{displayContent}</RegularText>
      </View>
      <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        {message.unread_count && message.unread_count > 0 ? (
          <BoldText fontSize={10} style={{ color: COLORS.primary }}>
            {message.unread_count}
          </BoldText>
        ) : null}
        <RegularText fontSize={10}>{formatToTime(message.created_at)}</RegularText>
      </View>
    </View>
  );
}

export default TextMessage;
