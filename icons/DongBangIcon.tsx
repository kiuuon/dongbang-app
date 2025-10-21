import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

export default function DongbangIcon() {
  return (
    <Svg width={53} height={53} viewBox="0 0 53 53" fill="none">
      <Path
        d="M4 0.75H28.5C41.3406 0.75 51.75 11.1594 51.75 24V28.5C51.75 41.3406 41.3406 51.75 28.5 51.75H4C2.20507 51.75 0.75 50.2949 0.75 48.5V4C0.75 2.20507 2.20507 0.75 4 0.75Z"
        fill="#F9A825"
        stroke="#F9A825"
        strokeWidth={1.5}
      />
      <Rect x={11.2505} y={11.249} width={19.5} height={30} rx={3.25} fill="white" stroke="#F9A825" strokeWidth={1.5} />
      <Circle cx={23.6248} cy={26.2547} r={2.62477} fill="#F9A825" />
    </Svg>
  );
}
