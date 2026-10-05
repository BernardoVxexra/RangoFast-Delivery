import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, font, radius } from '../theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'link';
}

export function Button({ label, onPress, loading, disabled, variant = 'primary' }: ButtonProps) {
  const isDisabled = disabled || loading;

  if (variant === 'link') {
    return (
      <Pressable onPress={onPress} disabled={isDisabled} hitSlop={8}>
        <Text style={[styles.linkLabel, isDisabled && styles.disabledText]}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' ? styles.secondary : styles.primary,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? colors.ink : colors.routeAmberInk} />
      ) : (
        <Text style={variant === 'secondary' ? styles.secondaryLabel : styles.primaryLabel}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.routeAmber,
    // Sombra sólida deslocada, não blur, efeito de ficha/etiqueta empilhada.
    shadowColor: colors.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.55,
  },
  primaryLabel: {
    fontFamily: font.bold,
    color: colors.routeAmberInk,
    fontSize: 15,
  },
  secondaryLabel: {
    fontFamily: font.bold,
    color: colors.ink,
    fontSize: 15,
  },
  linkLabel: {
    fontFamily: font.bold,
    color: colors.signalBlue,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  disabledText: {
    opacity: 0.55,
  },
});
