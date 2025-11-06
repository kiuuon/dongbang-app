import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

import COLORS from '@/constants/colors';
import { ClubType } from '@/types/ClubType';
import BoldText from '@/components/common/SemiBoldText';
import RegularText from '@/components/common/RegularText';
import { router } from 'expo-router';

interface ClubCardProps {
  club: ClubType;
}

export default function ClubCard({ club }: ClubCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={() => {
            router.push(`/explore/club/${club.id}`);
          }}
        >
          <Image source={{ uri: club.logo }} style={styles.logo} />

          <View style={styles.infoContainer}>
            <View style={styles.header}>
              <View style={styles.textGroup}>
                <BoldText fontSize={14} style={{ marginBottom: 6 }}>
                  {club.name}
                </BoldText>
                <RegularText fontSize={12} style={{ color: COLORS.gray2 }}>
                  {club.bio}
                </RegularText>
              </View>
            </View>

            <View style={styles.tagContainer}>
              {club.tags.slice(0, 3).map((tag) => (
                <View key={tag} style={styles.tag}>
                  <RegularText fontSize={12} style={{ color: COLORS.gray2 }}>
                    {tag}
                  </RegularText>
                </View>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 9,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.background,
    marginRight: 20,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  textGroup: {
    flex: 1,
    marginRight: 10,
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
