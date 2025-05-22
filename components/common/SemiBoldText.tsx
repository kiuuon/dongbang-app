import { Text, TextProps, StyleSheet } from 'react-native';

interface StyledTextProps extends TextProps {
  fontSize: number;
}

function BoldText({ style, fontSize, ...props }: StyledTextProps) {
  return <Text style={[styles.baseText, { fontSize }, { lineHeight: fontSize * 1.5 }, style]} {...props} />;
}

const styles = StyleSheet.create({
  baseText: {
    fontFamily: 'PretendardSemiBold',
    fontStyle: 'normal',
  },
});

export default BoldText;
