import { useRef, useState } from 'react';

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function startCamera() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsActive(true);
    } catch {
      setError('Não foi possível acessar a câmera.');
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsActive(false);
  }

  function takePhoto() {
    // getUserMedia só entrega um stream de vídeo contínuo; para obter uma
    // imagem estática é preciso desenhar o frame atual em um canvas e
    // exportá-lo. A câmera é liberada logo depois, por privacidade.
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    setPhotoUri(canvas.toDataURL('image/jpeg'));
    stopCamera();
  }

  function reset() {
    setPhotoUri(null);
    setError(null);
  }

  return { videoRef, isActive, photoUri, error, startCamera, takePhoto, reset };
}
