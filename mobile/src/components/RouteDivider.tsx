import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';

// Único motivo recorrente da interface: uma régua tracejada, referência
// direta à linha de faixa de rodovia. Usado só para separar seções.
export function RouteDivider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  divider: {
    borderTopWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.hairline,
    marginVertical: 4,
  },
});
