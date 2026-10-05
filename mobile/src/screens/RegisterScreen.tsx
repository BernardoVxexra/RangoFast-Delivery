import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { FeedbackModal } from '../components/FeedbackModal';
import { AppHeader } from '../components/AppHeader';
import { RouteDivider } from '../components/RouteDivider';
import { colors } from '../theme';
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
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppHeader subtitle="Criar conta de entregador" />

      <ScrollView contentContainerStyle={styles.body}>
        <Input label="Usuário" value={username} onChangeText={setUsername} autoCapitalize="none" />
        <Input label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Input label="CEP" value={cep} onChangeText={setCep} keyboardType="numeric" />
        <Input label="Senha" value={password} onChangeText={setPassword} secureTextEntry />

        <Button label="Cadastrar" onPress={handleRegister} loading={isLoading} />

        <RouteDivider />

        <Button label="Voltar" onPress={() => navigation.navigate('Login')} variant="link" />
      </ScrollView>

      <FeedbackModal
        visible={feedback !== null}
        message={feedback ?? ''}
        onClose={() => setFeedback(null)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  body: {
    paddingHorizontal: 24,
    paddingVertical: 28,
    gap: 12,
  },
});
