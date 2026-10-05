import { TextInput, Text, View, StyleSheet, TextInputProps } from 'react-native';
import { colors, font, radius } from '../theme';

interface InputProps extends TextInputProps {
  label: string;
  errorMessage?: string | null;
}

export function Input({ label, errorMessage, ...rest }: InputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor={colors.muted} {...rest} />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
    gap: 6,
  },
  label: {
    fontFamily: font.bold,
    fontSize: 13,
    color: colors.ink,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: font.regular,
    fontSize: 16,
    color: colors.ink,
    backgroundColor: colors.paperRaised,
  },
  error: {
    fontFamily: font.regular,
    color: colors.alertRed,
    fontSize: 13,
  },
});
