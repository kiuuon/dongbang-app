import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function LikesIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path
        d="M12.6666 9.33333C13.6599 8.36 14.6666 7.19333 14.6666 5.66667C14.6666 4.69421 14.2803 3.76158 13.5926 3.07394C12.905 2.38631 11.9724 2 10.9999 2C9.82658 2 8.99992 2.33333 7.99992 3.33333C6.99992 2.33333 6.17325 2 4.99992 2C4.02746 2 3.09483 2.38631 2.40719 3.07394C1.71956 3.76158 1.33325 4.69421 1.33325 5.66667C1.33325 7.2 2.33325 8.36667 3.33325 9.33333L7.99992 14L12.6666 9.33333Z"
        fill="#F40707"
        stroke="#F40707"
        strokeWidth={1.66667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
