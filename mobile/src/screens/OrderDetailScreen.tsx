import { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
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

      <ScrollView contentContainerStyle={styles.body}>
        {isLoading ? (
          <ActivityIndicator color={colors.ink} />
        ) : !order ? (
          <Text style={styles.errorText}>{error ?? 'Pedido não encontrado.'}</Text>
        ) : (
          <>
            <View style={styles.waybill}>
              <Text style={styles.waybillCode}>{order.code}</Text>

              <RouteDivider />

              <View style={styles.waybillBlock}>
                <Text style={styles.waybillRestaurant}>{order.restaurantName}</Text>
                <Text style={styles.waybillCustomer}>{order.customerName}</Text>
                <Text style={styles.waybillAddress}>{order.customerAddress}</Text>
              </View>

              <View style={styles.waybillItems}>
                {order.items.split(', ').map((item) => (
                  <View key={item} style={styles.waybillItemRow}>
                    <Text style={styles.waybillItemMark}>{'>'}</Text>
                    <Text style={styles.waybillItemText}>{item}</Text>
                  </View>
                ))}
              </View>

              {order.status === 'delivered' && order.deliveryPhotoUri && (
                <>
                  <RouteDivider />
                  <View style={styles.waybillProof}>
                    <Text style={styles.waybillProofLabel}>Comprovante</Text>
                    <Image source={{ uri: order.deliveryPhotoUri }} style={styles.proofPhoto} />
                  </View>
                </>
              )}

              <RouteDivider />

              <Text style={styles.waybillValue}>{formatCurrency(order.value)}</Text>
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
      </ScrollView>

      <FeedbackModal visible={feedback !== null} message={feedback ?? ''} onClose={() => setFeedback(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  body: { paddingHorizontal: 24, paddingVertical: 28, gap: 12 },
  mutedText: { fontFamily: font.regular, fontSize: 14, color: colors.muted },
  errorText: { fontFamily: font.regular, fontSize: 14, color: colors.alertRed },
  // Talão de entrega: o pedido tratado como documento de despacho — código
  // grande como número de rastreio, linhas tracejadas de "rasgo" entre
  // seções, não um card de formulário genérico.
  waybill: {
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.md + 2,
    backgroundColor: colors.paperRaised,
    padding: 20,
    gap: 14,
  },
  waybillCode: {
    fontFamily: font.black,
    fontSize: 30,
    color: colors.ink,
    letterSpacing: 0.3,
  },
  waybillBlock: { gap: 2 },
  waybillRestaurant: { fontFamily: font.bold, fontSize: 18, color: colors.ink },
  waybillCustomer: { fontFamily: font.regular, fontSize: 15, color: colors.ink },
  waybillAddress: { fontFamily: font.regular, fontSize: 14, color: colors.muted },
  waybillItems: { gap: 4 },
  waybillItemRow: { flexDirection: 'row', gap: 8 },
  waybillItemMark: { fontFamily: font.black, fontSize: 15, color: colors.routeAmber },
  waybillItemText: { fontFamily: font.regular, fontSize: 15, color: colors.ink, flexShrink: 1 },
  waybillProof: { gap: 8 },
  waybillProofLabel: { fontFamily: font.bold, fontSize: 13, color: colors.muted },
  waybillValue: {
    fontFamily: font.black,
    fontSize: 24,
    color: colors.ink,
    alignSelf: 'flex-end',
  },
  proofPhoto: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: radius.md,
  },
});
