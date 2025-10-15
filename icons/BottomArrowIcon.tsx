import React from 'react';
import Svg, { Path, Defs, ClipPath, Rect, G } from 'react-native-svg';

export default function BottomArrowIcon3() {
  return (
    <Svg width={5} height={5} viewBox="0 0 5 5" fill="none">
      <G clipPath="url(#clip0_4333_4046)">
        <Path
          d="M0.743652 1.62207L2.4999 3.37832L4.25615 1.62207"
          stroke="#C3C3C3"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_4333_4046">
          <Rect width={5} height={5} fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
