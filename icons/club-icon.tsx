import React from 'react';
import Svg, { Path, Rect, Circle, Defs, Mask } from 'react-native-svg';

export default function ClubIcon({ color }: { color: string }) {
  const isPrimary = color === '#F9A825';

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5.57129 3.75H12C16.5563 3.75 20.25 7.44365 20.25 12C20.25 16.5563 16.5563 20.25 12 20.25H5.57129C4.56545 20.2499 3.75008 19.4345 3.75 18.4287V5.57129C3.75008 4.56545 4.56545 3.75008 5.57129 3.75Z"
        stroke={color}
        strokeWidth={1.5}
        fill={isPrimary ? color : 'none'}
      />

      <Defs>
        <Mask id="path-2-inside-1_2081_1624" x={6.6001} y={6.59961} width={7.2} height={10.8}>
          <Rect x={6.6001} y={6.59961} width={7.2} height={10.8} rx={1} fill="white" />
        </Mask>
      </Defs>

      <Rect
        x={6.6001}
        y={6.59961}
        width={7.2}
        height={10.8}
        rx={1}
        fill="white"
        stroke={isPrimary ? 'none' : color}
        strokeWidth={1.5}
      />

      <Circle cx={11.0999} cy={12.0017} r={0.89992} fill={color} />
    </Svg>
  );
}
