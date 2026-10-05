import { Modal, View, Text, StyleSheet } from 'react-native';
import { Button } from './Button';
import { colors, font, radius } from '../theme';

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
    backgroundColor: 'rgba(26, 30, 34, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: colors.paperRaised,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.hairline,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    gap: 16,
    shadowColor: colors.ink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  message: {
    fontFamily: font.regular,
    fontSize: 15,
    color: colors.ink,
    textAlign: 'center',
  },
});
