import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCamera } from '../hooks/useCamera';
import { useAuth } from '../hooks/useAuth';
import { useOrder } from '../hooks/useOrder';
import { Button } from '../components/Button';
import { FeedbackModal } from '../components/FeedbackModal';

export function CameraScreen() {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const orderCode = (routerLocation.state as { orderCode?: string } | null)?.orderCode;
  const { videoRef, isActive, photoUri, error, startCamera, takePhoto, reset } = useCamera();
  const { user } = useAuth();
  const { complete, isSaving } = useOrder(orderCode, user);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);

  async function handleConfirmDelivery() {
    const result = await complete();
    setDeliveryConfirmed(result.ok);
    setFeedback(result.message);
  }

  function closeFeedback() {
    setFeedback(null);
    if (deliveryConfirmed) navigate('/dashboard');
  }

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
            {orderCode && (
              <Button label="Confirmar entrega" onClick={handleConfirmDelivery} loading={isSaving} />
            )}
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

      <FeedbackModal visible={feedback !== null} message={feedback ?? ''} onClose={closeFeedback} />
    </div>
  );
}
