import { useRef, useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Directory, File, Paths } from 'expo-file-system';

// O cache do expo-camera é temporário e pode ser limpo pelo sistema a
// qualquer momento; copiamos o comprovante para uma pasta própria e
// duradoura dentro do armazenamento do app.
async function persistPhoto(sourceUri: string): Promise<string> {
  const deliveryPhotosDir = new Directory(Paths.document, 'delivery-photos');
  deliveryPhotosDir.create({ idempotent: true });
  const destFile = new File(deliveryPhotosDir, `${Date.now()}.jpg`);
  await new File(sourceUri).copy(destFile);
  return destFile.uri;
}

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
      setPhotoUri(photo?.uri ? await persistPhoto(photo.uri) : null);
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
