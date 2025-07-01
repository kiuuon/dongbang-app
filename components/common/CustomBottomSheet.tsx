import { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetScrollView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';

import Colors from '@/constants/colors';

function CustomBottomSheet({
  isOpen,
  onClose,
  scrollable = false,
  height = -1,
  children,
  sheetRef,
}: {
  isOpen: boolean;
  onClose: () => void;
  scrollable?: boolean;
  height?: number;
  children: React.ReactNode;
  sheetRef?: React.RefObject<BottomSheetModal | null>;
}) {
  const internalRef = useRef<BottomSheetModal>(null);
  const bottomSheetModalRef = sheetRef ?? internalRef;

  const snapPoints = useMemo(() => ['50%'], []);

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
        <BottomSheetScrollView style={styles.sheetContent}>{children}</BottomSheetScrollView>
      ) : (
        <BottomSheetView style={styles.sheetContent}>{children}</BottomSheetView>
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
    marginBottom: 17,
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default CustomBottomSheet;
