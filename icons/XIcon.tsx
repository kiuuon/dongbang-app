import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export default function XIcon5() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Circle cx={8} cy={8} r={8} fill="#F9A825" />
      <Path d="M5 11L11 5M5 5L11 11" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
