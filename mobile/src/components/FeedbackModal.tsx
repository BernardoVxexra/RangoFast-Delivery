import { Modal, View, Text, StyleSheet } from 'react-native';
import { Button } from './Button';

interface FeedbackModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

export function FeedbackModal({ visible, message, onClose }: FeedbackModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.message}>{message}</Text>
          <Button label="OK" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    gap: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
});
