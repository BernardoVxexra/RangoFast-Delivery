import { useState } from 'react';
import { TextInput, Text, View, Pressable, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius } from '../theme';

interface InputProps extends TextInputProps {
  label: string;
  errorMessage?: string | null;
}

export function Input({ label, errorMessage, secureTextEntry, ...rest }: InputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, secureTextEntry ? styles.inputWithIcon : null]}
          placeholderTextColor={colors.muted}
          secureTextEntry={secureTextEntry && !visible}
          {...rest}
        />
        {secureTextEntry ? (
          <Pressable
            style={styles.toggle}
            onPress={() => setVisible((current) => !current)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'}
          >
            <Ionicons name={visible ? 'eye-off' : 'eye'} size={20} color={colors.muted} />
          </Pressable>
        ) : null}
      </View>
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
  inputWrapper: {
    justifyContent: 'center',
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
  inputWithIcon: {
    paddingRight: 44,
  },
  toggle: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
  },
  error: {
    fontFamily: font.regular,
    color: colors.alertRed,
    fontSize: 13,
  },
});
