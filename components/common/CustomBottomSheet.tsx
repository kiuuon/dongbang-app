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

import COLORS from '@/constants/colors';
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
  indicator = true,
  backgroundColor = COLORS.white,
}: {
  isOpen: boolean;
  onClose: () => void;
  scrollable?: boolean;
  height?: number;
  scrollViewHeight?: number | `${number}%`;
  children: React.ReactNode;
  sheetRef?: React.RefObject<BottomSheetModal | null>;
  title?: string;
  indicator?: boolean;
  backgroundColor?: string;
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
      backgroundStyle={[styles.sheetBackground, { backgroundColor }]}
      handleIndicatorStyle={[styles.handleIndicator, { display: indicator ? 'flex' : 'none' }]}
      {...bottomSheetProps}
    >
      {scrollable ? (
        <View>
          {title && (
            <BoldText fontSize={14} style={{ marginBottom: 28, width: '100%', textAlign: 'center' }}>
              {title}
            </BoldText>
          )}
          <BottomSheetScrollView style={{ maxHeight: scrollViewHeight }}>{children}</BottomSheetScrollView>
        </View>
      ) : (
        <BottomSheetView>
          {title && (
            <BoldText fontSize={14} style={{ marginBottom: 28, width: '100%', textAlign: 'center' }}>
              {title}
            </BoldText>
          )}
          <SafeAreaView edges={['bottom']} style={{ width: '100%', backgroundColor: COLORS.white }}>
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
    backgroundColor: COLORS.white,
  },
  handleIndicator: {
    backgroundColor: COLORS.gray1,
    width: 37,
    height: 2,
    alignSelf: 'center',
    marginVertical: 6,
  },
});

export default CustomBottomSheet;
