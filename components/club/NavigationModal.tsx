import { Modal, View, TouchableOpacity, StyleSheet, Pressable, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { fetchMyClubs } from '@/apis/club';
import Colors from '@/constants/colors';
import BoldText from '@/components/common/SemiBoldText';

export default function NavigationModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { clubId } = useLocalSearchParams();

  const { data: myClubs } = useQuery({
    queryKey: ['myClubs'],
    queryFn: fetchMyClubs,
  });

  const goToSelectedClub = (selectedClubId: string) => {
    router.replace(`/club/${selectedClubId}`);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
      <View style={styles.container}>
        <Pressable style={styles.overlay} onPress={onClose} />

        <View style={styles.modal}>
          {myClubs?.map(
            (club) =>
              club.id !== clubId && (
                <TouchableOpacity key={club.id} style={styles.modalButton} onPress={() => goToSelectedClub(club.id)}>
                  <Image
                    source={{ uri: club.logo }}
                    style={{
                      width: 50,
                      height: 50,
                      borderWidth: 1,
                      borderColor: Colors.background,
                      borderRadius: '50%',
                    }}
                  />
                  <BoldText fontSize={16}>{club.name}</BoldText>
                </TouchableOpacity>
              ),
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.black,
    opacity: 0.6,
  },
  modal: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: Colors.white,
    height: 337,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 24,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray0,
  },
});
