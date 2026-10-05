import { useNavigate } from 'react-router-dom';
import { useCamera } from '../hooks/useCamera';
import { Button } from '../components/Button';

export function CameraScreen() {
  const navigate = useNavigate();
  const { videoRef, isActive, photoUri, error, startCamera, takePhoto, reset } = useCamera();

  return (
    <div className="screen">
      <header className="app-header">
        <div className="wordmark">
          Rango<span className="wordmark__chevron">&gt;</span>Fast
        </div>
        <p className="app-header__subtitle">Comprovante de entrega</p>
      </header>

      <div className="screen__body">
        {photoUri ? (
          <>
            <div className="camera-viewfinder">
              <img src={photoUri} alt="Comprovante capturado" className="camera-preview" />
            </div>
            <Button label="Nova foto" onClick={reset} variant="secondary" />
          </>
        ) : (
          <>
            <div className="camera-viewfinder">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video ref={videoRef} className="camera-preview" muted playsInline />
              <span className="camera-viewfinder__corner camera-viewfinder__corner--tl" />
              <span className="camera-viewfinder__corner camera-viewfinder__corner--tr" />
              <span className="camera-viewfinder__corner camera-viewfinder__corner--bl" />
              <span className="camera-viewfinder__corner camera-viewfinder__corner--br" />
            </div>
            {error && <p className="error-text">{error}</p>}
            {isActive ? (
              <Button label="Capturar comprovante" onClick={takePhoto} />
            ) : (
              <Button label="Ativar câmera" onClick={startCamera} />
            )}
          </>
        )}

        <hr className="route-divider" />

        <Button label="Voltar ao dashboard" onClick={() => navigate('/dashboard')} variant="link" />
      </div>
    </div>
  );
}
