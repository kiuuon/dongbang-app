import Svg, { Rect, Circle } from 'react-native-svg';

export default function ToggleIcon2({ active }: { active: boolean }) {
  return active ? (
    <Svg width={40} height={20} viewBox="0 0 40 20" fill="none">
      <Rect width={40} height={20} rx={10} fill="#F9A825" />
      <Circle cx={29} cy={10} r={7} fill="white" />
    </Svg>
  ) : (
    <Svg width={40} height={20} viewBox="0 0 40 20" fill="none">
      <Rect width={40} height={20} rx={10} fill="#EDF0F4" />
      <Circle cx={11} cy={10} r={7} fill="white" />
    </Svg>
  );
}
