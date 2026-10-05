import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
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
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppHeader subtitle="Acesso do entregador" />

      <View style={styles.body}>
        <Input label="Usuário" value={username} onChangeText={setUsername} autoCapitalize="none" />
        <Input label="Senha" value={password} onChangeText={setPassword} secureTextEntry />

        <Button label="Entrar" onPress={handleLogin} loading={isLoading} />

        <RouteDivider />

        <Button label="Criar conta" onPress={() => navigation.navigate('Register')} variant="link" />
      </View>

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
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 28,
    gap: 12,
  },
});
