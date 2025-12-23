import { useEffect, useState } from 'react';
import { AppState, Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';

import COLORS from '@/constants/colors';
import LeftArrowIcon from '@/icons/LeftArrowIcon';
import ToggleIcon from '@/icons/ToggleIcon';
import RightArrowIcon2 from '@/icons/RightArrowIcon2';
import BoldText from '@/components/common/SemiBoldText';
import RegularText from '@/components/common/RegularText';

function SettingScreen() {
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState<Notifications.PermissionStatus | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      setNotificationPermissionStatus(status);
    })();

    const sub = AppState.addEventListener('change', async (state) => {
      if (state === 'active') {
        const { status } = await Notifications.getPermissionsAsync();
        setNotificationPermissionStatus(status);
      }
    });
    return () => sub.remove();
  }, []);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 60,
          paddingHorizontal: 20,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 10 }}>
          <LeftArrowIcon color={COLORS.black} />
        </TouchableOpacity>
        <BoldText fontSize={16}>설정</BoldText>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            Linking.openSettings();
          }}
        >
          <RegularText fontSize={14}>푸시 알림</RegularText>
          <ToggleIcon active={notificationPermissionStatus === 'granted'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <RegularText fontSize={14}>공지사항</RegularText>
          <RightArrowIcon2 />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <RegularText fontSize={14}>문의하기</RegularText>
          <RightArrowIcon2 />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/setting/terms')}>
          <RegularText fontSize={14}>약관 및 정책</RegularText>
          <RightArrowIcon2 />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'column',
    marginTop: 22,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray0,
  },
  button: {
    paddingLeft: 24,
    paddingRight: 20,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray0,
  },
});

export default SettingScreen;
