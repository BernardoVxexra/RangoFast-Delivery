import { View, Text, Image, StyleSheet } from 'react-native';
import { CameraView } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { useCamera } from '../hooks/useCamera';
import { Button } from '../components/Button';

export function CameraScreen() {
  const navigation = useNavigation();
  const { cameraRef, permission, requestPermission, photoUri, error, takePhoto, reset } =
    useCamera();

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>A câmera é necessária para registrar o comprovante.</Text>
        <Button label="Permitir câmera" onPress={requestPermission} />
      </View>
    );
  }

  if (photoUri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photoUri }} style={styles.preview} />
        <Button label="Nova foto" onPress={reset} />
        <Button label="Voltar ao dashboard" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button label="Capturar comprovante" onPress={takePhoto} />
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
  message: {
    textAlign: 'center',
    marginBottom: 12,
  },
  camera: {
    flex: 1,
    borderRadius: 12,
  },
  preview: {
    flex: 1,
    borderRadius: 12,
  },
  error: {
    textAlign: 'center',
    color: '#D32F2F',
  },
});
