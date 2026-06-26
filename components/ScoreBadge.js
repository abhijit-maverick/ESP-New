import { StyleSheet, Text, View } from 'react-native';
import { colors, shadow } from '../theme';

export default function ScoreBadge({ correct, total }) {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  return (
    <View style={styles.row}>
      <View style={[styles.badge, shadow]}>
        <Text style={styles.value}>{correct}</Text>
        <Text style={styles.label}>Correct</Text>
      </View>
      <View style={[styles.badge, shadow]}>
        <Text style={styles.value}>{total}</Text>
        <Text style={styles.label}>Attempts</Text>
      </View>
      <View style={[styles.badge, shadow]}>
        <Text style={styles.value}>{accuracy}%</Text>
        <Text style={styles.label}>Accuracy</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
    marginVertical: 16,
  },
  badge: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  label: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: '600',
  },
});
