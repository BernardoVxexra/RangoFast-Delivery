import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { FeedbackModal } from '../components/FeedbackModal';
import type { AuthStackParamList } from '../routes/AuthStack';

export function RegisterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { register, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleRegister() {
    try {
      await register(username, password, email, cep);
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Erro ao cadastrar.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>

      <Input label="Usuário" value={username} onChangeText={setUsername} autoCapitalize="none" />
      <Input label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <Input label="CEP" value={cep} onChangeText={setCep} keyboardType="numeric" />
      <Input label="Senha" value={password} onChangeText={setPassword} secureTextEntry />

      <Button label="Cadastrar" onPress={handleRegister} loading={isLoading} />
      <Button label="Voltar" onPress={() => navigation.navigate('Login')} />

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
    marginBottom: 24,
  },
});
