import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface TextMessageTailProps {
  isMine: boolean;
}

export default function TextMessageTail({ isMine }: TextMessageTailProps) {
  if (isMine) {
    return (
      <Svg width="20" height="16" viewBox="0 0 20 16" fill="none">
        <Path
          d="M19.1968 0.000336806C15.4568 8.08114 12.4534 11.5215 7.6063 15.4751L-1.82299e-06 2.30063C8.46274 3.40935 12.6455 2.84509 19.1968 0.000336806Z"
          fill="#F9A825"
        />
      </Svg>
    );
  }

  return (
    <Svg width="20" height="16" viewBox="0 0 20 16" fill="none">
      <Path
        d="M-5.09981e-05 0.000336806C3.73995 8.08114 6.74341 11.5215 11.5905 15.4751L19.1968 2.30063C10.734 3.40935 6.55131 2.84509 -5.09981e-05 0.000336806Z"
        fill="white"
      />
    </Svg>
  );
}
