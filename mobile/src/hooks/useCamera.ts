import { useRef, useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';

export function useCamera() {
  // CameraView expõe a captura via método imperativo no ref, não via props.
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function takePhoto() {
    setError(null);
    if (!cameraRef.current) {
      setError('Câmera não está pronta.');
      return;
    }
    try {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo?.uri ?? null);
    } catch {
      setError('Não foi possível capturar a foto.');
    }
  }

  function reset() {
    setPhotoUri(null);
    setError(null);
  }

  return { cameraRef, permission, requestPermission, photoUri, error, takePhoto, reset };
}
