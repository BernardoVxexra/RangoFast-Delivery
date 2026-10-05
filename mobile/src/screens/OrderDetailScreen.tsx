import { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { useOrder } from '../hooks/useOrder';
import { Button } from '../components/Button';
import { AppHeader } from '../components/AppHeader';
import { RouteDivider } from '../components/RouteDivider';
import { FeedbackModal } from '../components/FeedbackModal';
import { colors, font, radius } from '../theme';
import type { AppStackParamList } from '../routes/AppStack';

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function OrderDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute<RouteProp<AppStackParamList, 'OrderDetail'>>();
  const { code } = route.params;
  const { user } = useAuth();
  const { order, isLoading, isSaving, isMine, error, accept, cancel } = useOrder(code, user);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleAction(action: () => Promise<{ ok: boolean; message: string }>) {
    const result = await action();
    setFeedback(result.message);
  }

  return (
    <View style={styles.screen}>
      <AppHeader subtitle="Detalhe do pedido" />

      <View style={styles.body}>
        {isLoading ? (
          <ActivityIndicator color={colors.ink} />
        ) : !order ? (
          <Text style={styles.errorText}>{error ?? 'Pedido não encontrado.'}</Text>
        ) : (
          <>
            <Text style={styles.code}>{order.code}</Text>
            <View style={styles.infoCard}>
              <Info label="Restaurante" value={order.restaurantName} />
              <Info label="Cliente" value={order.customerName} />
              <Info label="Endereço" value={order.customerAddress} />
              <Info label="Itens" value={order.items} />
              <Info label="Valor" value={formatCurrency(order.value)} />
            </View>

            {order.status === 'available' && (
              <Button label="Aceitar entrega" onPress={() => handleAction(accept)} loading={isSaving} />
            )}

            {isMine && order.status === 'accepted' && (
              <>
                <Button
                  label="Concluir entrega"
                  onPress={() => navigation.navigate('Camera', { orderCode: order.code })}
                />
                <Button label="Cancelar" variant="secondary" onPress={() => handleAction(cancel)} loading={isSaving} />
              </>
            )}

            {!isMine && order.status === 'accepted' && (
              <Text style={styles.mutedText}>Em entrega por {order.assignedTo?.username}.</Text>
            )}

            {order.status === 'delivered' && (
              <Text style={styles.mutedText}>Entrega concluída.</Text>
            )}
          </>
        )}

        <RouteDivider />
        <Button label="Voltar" onPress={() => navigation.goBack()} variant="link" />
      </View>

      <FeedbackModal visible={feedback !== null} message={feedback ?? ''} onClose={() => setFeedback(null)} />
    </View>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  body: { flex: 1, paddingHorizontal: 24, paddingVertical: 28, gap: 12 },
  code: { fontFamily: font.black, fontSize: 28, color: colors.ink, letterSpacing: 0.5 },
  infoCard: {
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.md,
    backgroundColor: colors.paperRaised,
    padding: 16,
    gap: 10,
  },
  infoRow: { gap: 2 },
  infoLabel: { fontFamily: font.bold, fontSize: 12, color: colors.muted },
  infoValue: { fontFamily: font.regular, fontSize: 15, color: colors.ink },
  mutedText: { fontFamily: font.regular, fontSize: 14, color: colors.muted },
  errorText: { fontFamily: font.regular, fontSize: 14, color: colors.alertRed },
});
