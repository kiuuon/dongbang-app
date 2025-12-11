import Svg, { Rect, Circle } from 'react-native-svg';

type Props = { active: boolean };

export default function ToggleIcon({ active }: Props) {
  if (active) {
    return (
      <Svg width={44} height={24} viewBox="0 0 44 24">
        <Rect width={44} height={24} rx={12} fill="#F9A825" />
        <Circle cx={32} cy={12} r={8} fill="white" />
      </Svg>
    );
  }

  return (
    <Svg width={44} height={24} viewBox="0 0 44 24">
      <Rect width={44} height={24} rx={12} fill="#EDF0F4" />
      <Circle cx={12} cy={12} r={8} fill="white" />
    </Svg>
  );
}
