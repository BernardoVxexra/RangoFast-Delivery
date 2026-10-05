import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { getDeliveredByUser } from '../data/ordersRepository';
import { Button } from '../components/Button';
import { AppHeader } from '../components/AppHeader';
import { RouteDivider } from '../components/RouteDivider';
import { colors, font, radius } from '../theme';
import type { AppStackParamList } from '../routes/AppStack';

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { user, logout } = useAuth();
  const [deliveredCount, setDeliveredCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    getDeliveredByUser(user.username).then((orders) => setDeliveredCount(orders.length));
  }, [user]);

  return (
    <View style={styles.screen}>
      <AppHeader subtitle="Perfil" />

      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.label}>Usuário</Text>
          <Text style={styles.value}>{user?.username}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Entregas concluídas</Text>
          <Text style={styles.value}>{deliveredCount}</Text>
        </View>

        <RouteDivider />
        <Button label="Sair" onPress={logout} variant="secondary" />
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
    padding: 16,
    gap: 6,
  },
  label: { fontFamily: font.bold, fontSize: 12, color: colors.muted },
  value: { fontFamily: font.bold, fontSize: 20, color: colors.ink },
});
