import { useNavigate } from 'react-router-dom';
import { useCamera } from '../hooks/useCamera';
import { Button } from '../components/Button';

export function CameraScreen() {
  const navigate = useNavigate();
  const { videoRef, isActive, photoUri, error, startCamera, takePhoto, reset } = useCamera();

  return (
    <div className="screen">
      <h1>Comprovante de entrega</h1>

      {photoUri ? (
        <>
          <img src={photoUri} alt="Comprovante capturado" className="camera-preview" />
          <Button label="Nova foto" onClick={reset} />
        </>
      ) : (
        <>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video ref={videoRef} className="camera-preview" muted playsInline />
          {error && <p className="error-text">{error}</p>}
          {isActive ? (
            <Button label="Capturar comprovante" onClick={takePhoto} />
          ) : (
            <Button label="Ativar câmera" onClick={startCamera} />
          )}
        </>
      )}

      <Button label="Voltar ao dashboard" onClick={() => navigate('/dashboard')} variant="secondary" />
    </div>
  );
}
