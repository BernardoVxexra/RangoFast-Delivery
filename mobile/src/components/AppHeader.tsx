import { View, Text, StyleSheet } from 'react-native';
import { colors, font } from '../theme';

interface AppHeaderProps {
  subtitle: string;
}

export function AppHeader({ subtitle }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.wordmark}>
        <Text style={styles.wordmarkText}>Rango</Text>
        <Text style={styles.wordmarkChevron}>{'>'}</Text>
        <Text style={styles.wordmarkText}>Fast</Text>
      </View>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.ink,
    paddingTop: 56,
    paddingBottom: 22,
    paddingHorizontal: 24,
  },
  wordmark: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  wordmarkText: {
    fontFamily: font.black,
    fontSize: 26,
    color: colors.paper,
    letterSpacing: -0.5,
  },
  wordmarkChevron: {
    fontFamily: font.black,
    fontSize: 26,
    color: colors.routeAmber,
  },
  subtitle: {
    marginTop: 6,
    fontFamily: font.regular,
    fontSize: 14,
    color: 'rgba(238, 241, 243, 0.68)',
  },
});
