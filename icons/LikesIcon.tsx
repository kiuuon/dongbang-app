import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import React from 'react';

export default function LikesIcon2() {
  return (
    <Svg width="15" height="17" viewBox="0 0 15 17" fill="none">
      <Path
        d="M12.0962 14.0474C9.55779 16.6509 5.44221 16.6509 2.90381 14.0474C1.6346 12.7456 1 11.0395 1 9.33334C0.999997 7.62719 1.6346 5.92103 2.90381 4.61928C2.90381 4.61928 3.43754 5.99997 5.06254 6.8333C5.06254 5.16663 5.46879 2.66663 7.48853 1C9.125 2.66667 10.8241 3.31454 12.0962 4.61928C13.3654 5.92103 14 7.62719 14 9.33334C14 11.0395 13.3654 12.7456 12.0962 14.0474Z"
        stroke="url(#paint0_linear)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.77643 11.9344C6.72833 12.9107 8.27167 12.9107 9.22357 11.9344C9.69952 11.4463 9.93749 10.8065 9.9375 10.1667C9.93751 9.52685 9.69953 8.88703 9.22357 8.39887C8.75063 7.9138 8.13169 7.66973 7.51183 7.66666L6.68746 10.1666L5.0625 10.1667C5.06251 10.8065 5.30048 11.4463 5.77643 11.9344Z"
        stroke="url(#paint1_linear)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Defs>
        <LinearGradient id="paint0_linear" x1="7.5" y1="1" x2="7.5" y2="16" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FF512F" />
          <Stop offset="1" stopColor="#FFFA00" />
        </LinearGradient>
        <LinearGradient id="paint1_linear" x1="7.5" y1="1" x2="7.5" y2="16" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FF512F" />
          <Stop offset="1" stopColor="#FFFA00" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
