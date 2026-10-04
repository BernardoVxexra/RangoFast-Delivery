import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { FeedbackModal } from '../components/FeedbackModal';
import type { AuthStackParamList } from '../routes/AuthStack';

export function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleLogin() {
    try {
      await login(username, password);
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Erro ao entrar.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RangoFast Delivery</Text>
      <Text style={styles.subtitle}>Acesso do entregador</Text>

      <Input label="Usuário" value={username} onChangeText={setUsername} autoCapitalize="none" />
      <Input label="Senha" value={password} onChangeText={setPassword} secureTextEntry />

      <Button label="Entrar" onPress={handleLogin} loading={isLoading} />
      <Button label="Criar conta" onPress={() => navigation.navigate('Register')} />

      <FeedbackModal
        visible={feedback !== null}
        message={feedback ?? ''}
        onClose={() => setFeedback(null)}
      />
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
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
});
