import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from '../hooks/useLocation';
import { Button } from '../components/Button';
import { AppHeader } from '../components/AppHeader';
import { RouteDivider } from '../components/RouteDivider';
import { colors, font, radius } from '../theme';
import type { AppStackParamList } from '../routes/AppStack';

export function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { user, logout } = useAuth();
  const { coords, error, isLoading, requestLocation } = useLocation();

  return (
    <View style={styles.screen}>
      <AppHeader subtitle={`Olá, ${user?.username ?? ''}`} />

      <View style={styles.body}>
        <View style={styles.statusChip}>
          <Text style={styles.statusChipText}>Disponível para entregas</Text>
        </View>

        <Text style={styles.sectionTitle}>Localização atual</Text>

        {coords ? (
          <View style={styles.telemetryCard}>
            <Text style={styles.telemetryLabel}>Coordenadas</Text>
            <Text style={styles.telemetryValue}>
              {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
            </Text>
          </View>
        ) : (
          <Text style={error ? styles.errorText : styles.mutedText}>
            {error ?? 'Localização ainda não obtida.'}
          </Text>
        )}

        <Button
          label="Obter localização atual"
          onPress={requestLocation}
          loading={isLoading}
          variant="secondary"
        />

        <RouteDivider />

        <Button label="Registrar comprovante de entrega" onPress={() => navigation.navigate('Camera')} />
        <Button label="Sair" onPress={logout} variant="link" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 28,
    gap: 12,
  },
  statusChip: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(229, 148, 33, 0.16)',
    borderRadius: radius.sm,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusChipText: {
    fontFamily: font.bold,
    fontSize: 13,
    color: colors.routeAmber,
  },
  sectionTitle: {
    fontFamily: font.bold,
    fontSize: 18,
    color: colors.ink,
  },
  telemetryCard: {
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.md,
    backgroundColor: colors.paperRaised,
    padding: 16,
  },
  telemetryLabel: {
    fontFamily: font.bold,
    fontSize: 12,
    color: colors.muted,
    marginBottom: 8,
  },
  telemetryValue: {
    fontFamily: font.bold,
    fontSize: 18,
    letterSpacing: 0.5,
    color: colors.ink,
  },
  mutedText: {
    fontFamily: font.regular,
    fontSize: 14,
    color: colors.muted,
  },
  errorText: {
    fontFamily: font.regular,
    fontSize: 14,
    color: colors.alertRed,
  },
});
