import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from '../hooks/useLocation';
import { useMyActiveOrder } from '../hooks/useMyActiveOrder';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { AppHeader } from '../components/AppHeader';
import { RouteDivider } from '../components/RouteDivider';
import { FeedbackModal } from '../components/FeedbackModal';
import { isValidOrderCode } from '../utils/validators';
import { normalizeCode } from '../data/ordersRepository';
import { colors, font, radius } from '../theme';
import type { AppStackParamList } from '../routes/AppStack';

export function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { user, logout } = useAuth();
  const { coords, error, isLoading, requestLocation } = useLocation();
  const { order: activeOrder, isLoading: isLoadingOrder } = useMyActiveOrder(user);
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleSearch() {
    if (!isValidOrderCode(code)) {
      setFeedback('Código inválido. Use o formato RF-000.');
      return;
    }
    navigation.navigate('OrderDetail', { code: normalizeCode(code) });
  }

  return (
    <View style={styles.screen}>
      <AppHeader subtitle={`Olá, ${user?.username ?? ''}`} />

      <View style={styles.body}>
        <View style={styles.statusChip}>
          <Text style={styles.statusChipText}>Disponível para entregas</Text>
        </View>

        <Text style={styles.sectionTitle}>Minha entrega atual</Text>
        {isLoadingOrder ? (
          <Text style={styles.mutedText}>Carregando...</Text>
        ) : activeOrder ? (
          <View style={styles.telemetryCard}>
            <Text style={styles.telemetryLabel}>{activeOrder.code}</Text>
            <Text style={styles.telemetryValue}>{activeOrder.restaurantName}</Text>
            <Button
              label="Ver pedido"
              variant="secondary"
              onPress={() => navigation.navigate('OrderDetail', { code: activeOrder.code })}
            />
          </View>
        ) : (
          <Text style={styles.mutedText}>Você não está entregando nenhum pedido no momento.</Text>
        )}

        <RouteDivider />

        <Text style={styles.sectionTitle}>Buscar pedido</Text>
        <Input
          label="Código do pedido"
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
          placeholder="RF-001"
        />
        <Button label="Buscar" onPress={handleSearch} variant="secondary" />
        <Button label="Ler QR Code" onPress={() => navigation.navigate('Scanner')} />

        <RouteDivider />

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
        <Button label="Histórico de entregas" onPress={() => navigation.navigate('History')} variant="secondary" />
        <Button label="Perfil" onPress={() => navigation.navigate('Profile')} variant="secondary" />
        <Button label="Sair" onPress={logout} variant="link" />
      </View>

      <FeedbackModal
        visible={feedback !== null}
        message={feedback ?? ''}
        onClose={() => setFeedback(null)}
      />
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
    gap: 8,
  },
  telemetryLabel: {
    fontFamily: font.bold,
    fontSize: 12,
    color: colors.muted,
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
