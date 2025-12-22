import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

function BouncingMessage({ isSearchResult, children }: { isSearchResult: boolean; children: React.ReactNode }) {
  // 애니메이션 값 (y축 이동)
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isSearchResult) {
      // 0 -> -10(위로) -> 0(제자리) 순서로 튀게 만듦
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -15, // 얼마나 튈지
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 0,
          friction: 4, // 탄성 조절
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isSearchResult, bounceAnim]);

  return <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>{children}</Animated.View>;
}

export default BouncingMessage;
