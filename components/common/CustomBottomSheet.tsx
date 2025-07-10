import { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';

import Colors from '@/constants/colors';
import BoldText from './SemiBoldText';

function CustomBottomSheet({
  isOpen,
  onClose,
  scrollable = false,
  height = -1,
  scrollViewHeight = '100%',
  children,
  sheetRef,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  scrollable?: boolean;
  height?: number;
  scrollViewHeight?: number | `${number}%`;
  children: React.ReactNode;
  sheetRef?: React.RefObject<BottomSheetModal | null>;
  title?: string;
}) {
  const internalRef = useRef<BottomSheetModal>(null);
  const bottomSheetModalRef = sheetRef ?? internalRef;

  const snapPoints = useMemo(() => [height], [height]);

  const bottomSheetProps = height === -1 ? { enableDynamicSizing: true } : { snapPoints, enableDynamicSizing: false };

  useEffect(() => {
    if (isOpen) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isOpen, bottomSheetModalRef]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} pressBehavior="close" />
    ),
    [],
  );

  if (!isOpen) return null;

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      onDismiss={onClose}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      {...bottomSheetProps}
    >
      {scrollable ? (
        <View>
          {title && (
            <BoldText fontSize={14} style={{ marginBottom: 28, width: '100%', textAlign: 'center' }}>
              {title}
            </BoldText>
          )}
          <BottomSheetScrollView style={[styles.sheetContent, { maxHeight: scrollViewHeight }]}>
            {children}
          </BottomSheetScrollView>
        </View>
      ) : (
        <BottomSheetView style={styles.sheetContent}>
          {title && (
            <BoldText fontSize={14} style={{ marginBottom: 28, width: '100%', textAlign: 'center' }}>
              {title}
            </BoldText>
          )}
          <SafeAreaView edges={['bottom']} style={{ width: '100%' }}>
            {children}
          </SafeAreaView>
        </BottomSheetView>
      )}
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: Colors.white,
  },
  handleIndicator: {
    backgroundColor: Colors.gray1,
    width: 37,
    height: 4,
    alignSelf: 'center',
  },
  sheetContent: {
    paddingHorizontal: 20,
  },
});

export default CustomBottomSheet;
