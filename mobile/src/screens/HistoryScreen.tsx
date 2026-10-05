import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { getDeliveredByUser, Order } from '../data/ordersRepository';
import { Button } from '../components/Button';
import { AppHeader } from '../components/AppHeader';
import { RouteDivider } from '../components/RouteDivider';
import { colors, font, radius } from '../theme';
import type { AppStackParamList } from '../routes/AppStack';

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

export function HistoryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getDeliveredByUser(user.username).then(setOrders).finally(() => setIsLoading(false));
  }, [user]);

  return (
    <View style={styles.screen}>
      <AppHeader subtitle="Histórico de entregas" />

      <View style={styles.body}>
        {isLoading ? (
          <ActivityIndicator color={colors.ink} />
        ) : orders.length === 0 ? (
          <Text style={styles.mutedText}>Nenhuma entrega concluída ainda.</Text>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.code}
            contentContainerStyle={{ gap: 12 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.code}>{item.code}</Text>
                <Text style={styles.restaurant}>{item.restaurantName}</Text>
                <Text style={styles.mutedText}>
                  {formatCurrency(item.value)} · {formatDateTime(item.deliveredAt!)}
                </Text>
              </View>
            )}
          />
        )}

        <RouteDivider />
        <Button label="Voltar" onPress={() => navigation.goBack()} variant="link" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  body: { flex: 1, paddingHorizontal: 24, paddingVertical: 28, gap: 12 },
  card: {
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.md,
    backgroundColor: colors.paperRaised,
    padding: 14,
    gap: 4,
  },
  code: { fontFamily: font.bold, fontSize: 16, color: colors.ink },
  restaurant: { fontFamily: font.regular, fontSize: 14, color: colors.ink },
  mutedText: { fontFamily: font.regular, fontSize: 13, color: colors.muted },
});
