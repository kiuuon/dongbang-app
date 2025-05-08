import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function HomeIcon({ color }: { color: string }) {
  const isPrimary = color === '#F9A825';

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20.5 18.6359V12.3603C20.5 11.8546 20.3957 11.3542 20.1935 10.8896C19.9913 10.4249 19.6954 10.0057 19.3239 9.65744L13.3014 4.01247C12.9504 3.68345 12.4848 3.5 12.0006 3.5C11.5165 3.5 11.0508 3.68345 10.6998 4.01247L4.67552 9.65744C4.30408 10.0057 4.00832 10.425 3.80624 10.8896C3.60415 11.3543 3.49996 11.8547 3.5 12.3603V18.6359C3.5 19.1303 3.69901 19.6045 4.05324 19.954C4.40748 20.3036 4.88792 20.5 5.38889 20.5H18.6111C19.1121 20.5 19.5925 20.3036 19.9468 19.954C20.301 19.6045 20.5 19.1303 20.5 18.6359Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={isPrimary ? color : 'none'}
      />
    </Svg>
  );
}
