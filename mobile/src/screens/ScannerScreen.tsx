import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCameraPermissions } from 'expo-camera';
import { QrScanner } from '../components/QrScanner';
import { Button } from '../components/Button';
import { AppHeader } from '../components/AppHeader';
import { RouteDivider } from '../components/RouteDivider';
import { isValidOrderCode } from '../utils/validators';
import { normalizeCode } from '../data/ordersRepository';
import { colors, font, radius } from '../theme';
import type { AppStackParamList } from '../routes/AppStack';

export function ScannerScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanError, setScanError] = useState<string | null>(null);

  function handleScan(data: string) {
    if (!isValidOrderCode(data)) {
      setScanError('QR Code não corresponde a um pedido do RangoFast.');
      return;
    }
    setScanError(null);
    navigation.replace('OrderDetail', { code: normalizeCode(data) });
  }

  return (
    <View style={styles.screen}>
      <AppHeader subtitle="Escanear pedido" />

      <View style={styles.body}>
        {!permission ? (
          <View style={styles.viewfinder} />
        ) : !permission.granted ? (
          <>
            <Text style={styles.mutedText}>
              A câmera é necessária para ler o QR Code do pedido.
            </Text>
            <Button label="Permitir câmera" onPress={requestPermission} />
          </>
        ) : (
          <View style={styles.viewfinder}>
            <QrScanner active onScan={handleScan} />
          </View>
        )}

        {scanError && <Text style={styles.errorText}>{scanError}</Text>}

        <RouteDivider />
        <Button label="Voltar" onPress={() => navigation.goBack()} variant="link" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  body: { flex: 1, paddingHorizontal: 24, paddingVertical: 28, gap: 12 },
  viewfinder: { flex: 1, borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.ink },
  mutedText: { fontFamily: font.regular, fontSize: 14, color: colors.muted, textAlign: 'center' },
  errorText: { fontFamily: font.regular, fontSize: 14, color: colors.alertRed, textAlign: 'center' },
});
