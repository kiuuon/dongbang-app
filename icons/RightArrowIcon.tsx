import Svg, { Path } from 'react-native-svg';

export default function RightArrowIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12H19" stroke="#F9A825" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 5L19 12L12 19" stroke="#F9A825" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
