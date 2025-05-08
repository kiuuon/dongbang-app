import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function SearchIcon({ color }: { color: string }) {
  const isPrimary = color === '#F9A825';

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 21L16.7501 16.7425M19.1053 11.0526C19.1053 12.6453 18.633 14.2022 17.7482 15.5264C16.8633 16.8507 15.6057 17.8828 14.1342 18.4923C12.6628 19.1018 11.0437 19.2612 9.48164 18.9505C7.91959 18.6398 6.48474 17.8729 5.35856 16.7467C4.23238 15.6205 3.46545 14.1857 3.15473 12.6236C2.84402 11.0616 3.00349 9.44245 3.61297 7.97102C4.22246 6.4996 5.25458 5.24195 6.57883 4.35711C7.90308 3.47228 9.45997 3 11.0526 3C13.1883 3 15.2365 3.8484 16.7467 5.35856C18.2569 6.86872 19.1053 8.91694 19.1053 11.0526Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        fill={isPrimary ? color : 'none'}
      />
    </Svg>
  );
}
