import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import PressableScale from '../components/PressableScale';
import { colors, gradients, shadow } from '../theme';

const OPTIONS = [
  { count: 3, label: 'Easy', odds: '1 in 3' },
  { count: 4, label: 'Medium', odds: '1 in 4' },
  { count: 5, label: 'Hard', odds: '1 in 5' },
];

export default function BoxSelectScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Hidden Ball</Text>
        <Text style={styles.subtitle}>
          Pick a difficulty. A ball is hidden under one box — sense which one,
          tap it, then reveal.
        </Text>

        {OPTIONS.map((opt) => (
          <PressableScale
            key={opt.count}
            style={[styles.card, shadow]}
            onPress={() => navigation.navigate('BoxGame', { boxCount: opt.count })}
            scaleTo={0.97}
          >
            <LinearGradient
              colors={gradients.intermediate}
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.boxesPreview}>
                {Array.from({ length: opt.count }).map((_, i) => (
                  <Text key={i} style={styles.boxIcon}>📦</Text>
                ))}
              </View>
              <Text style={styles.cardTitle}>{opt.count} Boxes — {opt.label}</Text>
              <Text style={styles.cardSubtitle}>Odds: {opt.odds}</Text>
            </LinearGradient>
          </PressableScale>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, marginTop: 8 },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 4, marginBottom: 20, lineHeight: 20 },
  card: { borderRadius: 22, marginBottom: 18, overflow: 'hidden' },
  cardGradient: { padding: 18, borderRadius: 22 },
  boxesPreview: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  boxIcon: { fontSize: 26 },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  cardSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 2 },
});
