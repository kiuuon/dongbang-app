import { View, TouchableOpacity, StyleSheet, Modal, Image, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { fetchClubsByUserNickname } from '@/apis/club';
import COLORS from '@/constants/colors';
import { ERROR_MESSAGE } from '@/constants/error';
import { ClubType } from '@/types/ClubType';
import BoldText from '../common/SemiBoldText';

interface ClubsModalProps {
  visible: boolean;
  onClose: () => void;
  nickname: string;
  currentPath: '' | '/my' | '/feed' | '/explore' | '/interact' | '/club' | '/feed/detail';
}

export default function ClubsModal({ visible, onClose, nickname, currentPath }: ClubsModalProps) {
  const { data: clubs } = useQuery({
    queryKey: ['clubs', nickname],
    queryFn: () => fetchClubsByUserNickname(nickname as string),
    enabled: !!nickname,
    throwOnError: (error) => {
      Alert.alert(ERROR_MESSAGE.CLUB.LIST_FETCH_FAILED, error.message);
      return false;
    },
  });

  const goToProfilePage = (clubId: string) => {
    onClose();
    router.push(`${currentPath}/club/${clubId}`);
  };

  const getRole = (role: string) => {
    if (role === 'president') {
      return '회장';
    }

    if (role === 'officer') {
      return '임원';
    }

    if (role === 'member') {
      return '부원';
    }
    return '';
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ padding: 32, gap: 30 }}
          showsVerticalScrollIndicator={false}
        >
          <BoldText fontSize={14} style={{ width: '100%', textAlign: 'center' }}>
            소속 동아리
          </BoldText>

          <View style={styles.buttonContainer}>
            {clubs?.map((item: { club: ClubType; role: string }) => (
              <TouchableOpacity
                key={item.club.id}
                style={styles.button}
                onPress={() => {
                  goToProfilePage(item.club.id);
                }}
              >
                <Image source={{ uri: item.club.logo }} style={styles.memberImage} />

                <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                  <BoldText fontSize={16} style={{ height: 19 }}>
                    {item.club.name}
                  </BoldText>
                  <BoldText fontSize={12} style={{ height: 14, color: COLORS.gray2 }}>
                    {getRole(item.role)}
                  </BoldText>
                  <View style={styles.tagContainer}>
                    {item.club.tags.slice(0, 3).map((tag: string) => (
                      <View key={tag} style={styles.tag}>
                        <BoldText fontSize={10} style={{ color: COLORS.gray2 }}>
                          {tag}
                        </BoldText>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
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
    gap: 32,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 30,
  },
  button: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  memberImage: {
    width: 60,
    height: 60,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.background,
  },
  tagContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  tag: {
    backgroundColor: COLORS.gray0,
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
});
