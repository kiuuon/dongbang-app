import { View, TouchableOpacity, StyleSheet, Modal, Image, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { fetchClubMembers } from '@/apis/club';
import COLORS from '@/constants/colors';
import { ERROR_MESSAGE } from '@/constants/error';
import BoldText from '../common/SemiBoldText';
import RegularText from '../common/RegularText';

interface MembersModalProps {
  visible: boolean;
  onClose: () => void;
  clubId: string;
  currentPath: '' | '/my' | '/feed' | '/explore' | '/interact' | '/club' | '/feed/detail';
}

export default function MembersModal({ visible, onClose, clubId, currentPath }: MembersModalProps) {
  const { data: members } = useQuery({
    queryKey: ['clubMembers', clubId],
    queryFn: () => fetchClubMembers(clubId as string),
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.CLUB.MEMBERS_FETCH_FAILED, error.message);
      return false;
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const goToProfilePage = (userId: string) => {
    onClose();
    router.push(`${currentPath}/profile/${userId}`);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >
          {/* 회장 */}
          <View style={{ flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            <BoldText fontSize={14}>회장</BoldText>
            <View style={styles.buttonContainer}>
              {members?.map(
                (member) =>
                  member.role === 'president' && (
                    <TouchableOpacity
                      key={member.userId}
                      style={styles.button}
                      onPress={() => {
                        goToProfilePage(member.userId);
                      }}
                    >
                      {member.avatar ? (
                        <Image source={{ uri: member.avatar }} style={styles.memberImage} />
                      ) : (
                        // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
                        <Image source={require('@/assets/images/none_avatar.png')} style={styles.memberImage} />
                      )}
                      <View>
                        <BoldText fontSize={14} style={{ height: 17 }}>
                          {member.name}
                        </BoldText>
                        <RegularText fontSize={12} style={{ color: COLORS.gray2, height: 14 }}>
                          {member.nickname}
                        </RegularText>
                      </View>
                    </TouchableOpacity>
                  ),
              )}
            </View>
          </View>

          {/* 임원 */}
          <View style={{ flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            <BoldText fontSize={14}>임원</BoldText>
            <View style={styles.buttonContainer}>
              {members?.map(
                (member) =>
                  member.role === 'officer' && (
                    <TouchableOpacity
                      key={member.userId}
                      style={styles.button}
                      onPress={() => {
                        goToProfilePage(member.userId);
                      }}
                    >
                      {member.avatar ? (
                        <Image source={{ uri: member.avatar }} style={styles.memberImage} />
                      ) : (
                        // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
                        <Image source={require('@/assets/images/none_avatar.png')} style={styles.memberImage} />
                      )}
                      <View>
                        <BoldText fontSize={14} style={{ height: 17 }}>
                          {member.name}
                        </BoldText>
                        <RegularText fontSize={12} style={{ color: COLORS.gray2, height: 14 }}>
                          {member.nickname}
                        </RegularText>
                      </View>
                    </TouchableOpacity>
                  ),
              )}
            </View>
          </View>

          {/* 부원 */}
          <View style={{ flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            <BoldText fontSize={14}>부원</BoldText>
            <View style={styles.buttonContainer}>
              {members?.map(
                (member) =>
                  member.role === 'member' && (
                    <TouchableOpacity
                      key={member.userId}
                      style={styles.button}
                      onPress={() => {
                        goToProfilePage(member.userId);
                      }}
                    >
                      {member.avatar ? (
                        <Image source={{ uri: member.avatar }} style={styles.memberImage} />
                      ) : (
                        // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
                        <Image source={require('@/assets/images/none_avatar.png')} style={styles.memberImage} />
                      )}
                      <View>
                        <BoldText fontSize={14} style={{ height: 17 }}>
                          {member.name}
                        </BoldText>
                        <RegularText fontSize={12} style={{ color: COLORS.gray2, height: 14 }}>
                          {member.nickname}
                        </RegularText>
                      </View>
                    </TouchableOpacity>
                  ),
              )}
            </View>
          </View>
        </ScrollView>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.modalBackdrop,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  container: {
    flexDirection: 'column',
    width: '100%',
    maxHeight: 420,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    opacity: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  memberImage: {
    width: 32,
    height: 32,
    borderRadius: '100%',
  },
});
