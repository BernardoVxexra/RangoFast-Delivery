import { View, Text, Image, StyleSheet } from 'react-native';
import { CameraView } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { useCamera } from '../hooks/useCamera';
import { Button } from '../components/Button';
import { AppHeader } from '../components/AppHeader';
import { RouteDivider } from '../components/RouteDivider';
import { colors, font, radius } from '../theme';

export function CameraScreen() {
  const navigation = useNavigation();
  const { cameraRef, permission, requestPermission, photoUri, error, takePhoto, reset } =
    useCamera();

  return (
    <View style={styles.screen}>
      <AppHeader subtitle="Comprovante de entrega" />

      <View style={styles.body}>
        {!permission ? (
          <View style={styles.viewfinder} />
        ) : !permission.granted ? (
          <>
            <Text style={styles.mutedText}>
              A câmera é necessária para registrar o comprovante.
            </Text>
            <Button label="Permitir câmera" onPress={requestPermission} />
          </>
        ) : photoUri ? (
          <>
            <View style={styles.viewfinder}>
              <Image source={{ uri: photoUri }} style={styles.media} />
            </View>
            <Button label="Nova foto" onPress={reset} variant="secondary" />
          </>
        ) : (
          <>
            <View style={styles.viewfinder}>
              <CameraView ref={cameraRef} style={styles.media} facing="back" />
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <Button label="Capturar comprovante" onPress={takePhoto} />
          </>
        )}

        <RouteDivider />

        <Button label="Voltar ao dashboard" onPress={() => navigation.goBack()} variant="link" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 28,
    gap: 12,
  },
  viewfinder: {
    flex: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.ink,
  },
  media: {
    flex: 1,
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: colors.routeAmber,
    borderWidth: 3,
  },
  cornerTL: { top: 10, left: 10, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 10, right: 10, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 10, left: 10, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 10, right: 10, borderLeftWidth: 0, borderTopWidth: 0 },
  mutedText: {
    fontFamily: font.regular,
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
  },
  errorText: {
    fontFamily: font.regular,
    fontSize: 14,
    color: colors.alertRed,
    textAlign: 'center',
  },
});
