import { Button } from './Button';

interface FeedbackModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

export function FeedbackModal({ visible, message, onClose }: FeedbackModalProps) {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <p>{message}</p>
        <Button label="OK" onClick={onClose} />
      </div>
    </div>
  );
}
