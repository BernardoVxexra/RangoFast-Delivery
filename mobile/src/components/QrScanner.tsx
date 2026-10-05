import { useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CameraView, BarcodeScanningResult } from 'expo-camera';
import { colors, font } from '../theme';

type Props = {
  active: boolean;
  onScan: (data: string) => void;
};

const FRAME_SIZE = 240;

// Leitor de QR Code com a câmera. A câmera dispara várias leituras por
// segundo do mesmo código; a trava evita chamar onScan repetidamente.
export function QrScanner({ active, onScan }: Props) {
  const locked = useRef(false);

  function handleScanned({ data }: BarcodeScanningResult) {
    if (locked.current) return;
    locked.current = true;
    onScan(data);
    setTimeout(() => { locked.current = false; }, 2000);
  }

  return (
    <View style={styles.container}>
      {active && (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={handleScanned}
        />
      )}

      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.frame} />
        <Text style={styles.hint}>Aponte para o QR Code do pedido</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderWidth: 3,
    borderColor: colors.paper,
    borderRadius: 20,
  },
  hint: {
    fontFamily: font.bold,
    color: colors.paper,
    fontSize: 15,
    backgroundColor: 'rgba(26,30,34,0.6)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
});
