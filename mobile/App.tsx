import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from '@expo-google-fonts/archivo/useFonts';
// Import por peso específico: evita empacotar as 18 variações da fonte
// quando só 3 pesos são usados no app.
import { Archivo_400Regular } from '@expo-google-fonts/archivo/400Regular';
import { Archivo_700Bold } from '@expo-google-fonts/archivo/700Bold';
import { Archivo_900Black } from '@expo-google-fonts/archivo/900Black';
import { AuthProvider } from './src/contexts/AuthContext';
import { Routes } from './src/routes';
import { colors } from './src/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    Archivo_400Regular,
    Archivo_700Bold,
    Archivo_900Black,
  });

  // Evita o "flash" de texto na fonte do sistema antes da Archivo carregar.
  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.paper }} />;
  }

  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Routes />
    </AuthProvider>
  );
}
