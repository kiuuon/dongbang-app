import React from 'react';
import Svg, { G, Path, Defs, ClipPath, Rect } from 'react-native-svg';

export default function LeftArrowIcon({ color = '#000' }: { color?: string }) {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0_1998_602)">
        <Path
          d="M10.9681 4.797L3.76807 11.997M3.76807 11.997L10.9681 19.197M3.76807 11.997H20.2321"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_1998_602">
          <Rect width="24" height="24" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
