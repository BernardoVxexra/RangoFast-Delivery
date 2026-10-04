import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from '../hooks/useLocation';
import { Button } from '../components/Button';
import type { AppStackParamList } from '../routes/AppStack';

export function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { user, logout } = useAuth();
  const { coords, error, isLoading, requestLocation } = useLocation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá, {user?.username}</Text>

      <Button label="Obter localização atual" onPress={requestLocation} loading={isLoading} />
      {coords && (
        <Text style={styles.info}>
          Lat: {coords.latitude.toFixed(5)} · Lng: {coords.longitude.toFixed(5)}
        </Text>
      )}
      {error && <Text style={styles.error}>{error}</Text>}

      <Button label="Registrar comprovante de entrega" onPress={() => navigation.navigate('Camera')} />
      <Button label="Sair" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  info: {
    textAlign: 'center',
    color: '#333',
  },
  error: {
    textAlign: 'center',
    color: '#D32F2F',
  },
});
