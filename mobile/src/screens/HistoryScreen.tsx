import { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
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
                {item.deliveryPhotoUri && (
                  <Image source={{ uri: item.deliveryPhotoUri }} style={styles.thumbnail} />
                )}
                <View style={styles.cardHeading}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{item.code}</Text>
                  </View>
                  <Text style={styles.restaurant}>{item.restaurantName}</Text>
                </View>
                <RouteDivider />
                <View style={styles.cardFooter}>
                  <Text style={styles.value}>{formatCurrency(item.value)}</Text>
                  <Text style={styles.mutedText}>{formatDateTime(item.deliveredAt!)}</Text>
                </View>
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
  cardHeading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tag: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(229, 148, 33, 0.16)',
  },
  tagText: { fontFamily: font.bold, fontSize: 12, color: colors.routeAmber },
  restaurant: { fontFamily: font.bold, fontSize: 15, color: colors.ink, flexShrink: 1 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  value: { fontFamily: font.bold, fontSize: 15, color: colors.ink },
  mutedText: { fontFamily: font.regular, fontSize: 13, color: colors.muted },
  thumbnail: {
    width: '100%',
    height: 140,
    borderRadius: radius.md,
  },
});
