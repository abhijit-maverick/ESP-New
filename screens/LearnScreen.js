import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, shadow } from '../theme';

const STEPS = [
  {
    icon: '🧘',
    title: '1 · Relax & center',
    body:
      'Sit comfortably and take five slow breaths. ESP signals are faint — a calm, quiet mind makes them easier to notice. Tension and over-thinking drown the signal out.',
  },
  {
    icon: '🎯',
    title: '2 · Set a clear intention',
    body:
      'Before each round, silently state what you are sensing: "Which symbol?" or "Where is the ball?". A focused question gives your intuition something specific to answer.',
  },
  {
    icon: '⚡',
    title: '3 · Trust the first impression',
    body:
      'The very first image, word, or pull you feel is usually the intuitive one. Second-guessing replaces intuition with logic. Commit to your first hit and tap.',
  },
  {
    icon: '🔊',
    title: '4 · Separate signal from noise',
    body:
      'Notice the difference between a genuine "knowing" and a random guess or wishful thinking. Over time you will learn your own personal signal — a tingle, a color, a lean.',
  },
  {
    icon: '🫧',
    title: '5 · Stay non-attached',
    body:
      'Wanting to be right creates pressure that distorts perception. Treat each call as a relaxed experiment. Curiosity beats craving every time.',
  },
  {
    icon: '📈',
    title: '6 · Review your tracker',
    body:
      'Open the ESP Tracker often. Look for accuracy that stays above chance across many attempts — that long-run edge, not any single streak, is the real measure of progress.',
  },
  {
    icon: '🔁',
    title: '7 · Practice little and often',
    body:
      'Short daily sessions of 5–10 calls beat occasional long ones. Like a muscle, perception strengthens with frequent, low-pressure repetition.',
  },
];

const PROTOCOL = [
  'Breathe and relax for a few seconds.',
  'Ask your question and clear your mind.',
  'Wait for the first impression to arrive.',
  'Commit and tap — no second-guessing.',
  'Note the result and move on calmly.',
];

export default function LearnScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#A18CD1', '#FBC2EB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, shadow]}
        >
          <Text style={styles.heroIcon}>🧠</Text>
          <Text style={styles.heroTitle}>Train Your ESP</Text>
          <Text style={styles.heroText}>
            Extrasensory perception behaves like a skill. These steps help you create the calm,
            focused state where intuition can surface — and a routine to practice it.
          </Text>
        </LinearGradient>

        <Text style={styles.sectionLabel}>Core Techniques</Text>
        {STEPS.map((s) => (
          <View key={s.title} style={[styles.card, shadow]}>
            <Text style={styles.cardIcon}>{s.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{s.title}</Text>
              <Text style={styles.cardBody}>{s.body}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.sectionLabel}>The 5-Second Protocol</Text>
        <View style={[styles.protocol, shadow]}>
          {PROTOCOL.map((line, i) => (
            <View key={i} style={styles.protocolRow}>
              <View style={styles.protocolNum}>
                <Text style={styles.protocolNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.protocolText}>{line}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.note, shadow]}>
          <Text style={styles.noteText}>
            Remember: results swing wildly in the short term. Judge progress by your long-run
            accuracy in the tracker, not by any single round.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  hero: { borderRadius: 24, padding: 22, marginBottom: 8 },
  heroIcon: { fontSize: 40, marginBottom: 8 },
  heroTitle: { fontSize: 24, fontWeight: '900', color: '#fff', marginBottom: 8 },
  heroText: { fontSize: 14, color: 'rgba(255,255,255,0.95)', lineHeight: 21 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginTop: 22,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  cardIcon: { fontSize: 26, marginRight: 14, marginTop: 2 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 4 },
  cardBody: { fontSize: 14, color: colors.textMuted, lineHeight: 20 },
  protocol: { backgroundColor: colors.surface, borderRadius: 18, padding: 16 },
  protocolRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 7 },
  protocolNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  protocolNumText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  protocolText: { flex: 1, fontSize: 14, color: colors.text, fontWeight: '500' },
  note: { backgroundColor: '#EEF0FB', borderRadius: 18, padding: 16, marginTop: 18 },
  noteText: { fontSize: 13, color: colors.textMuted, lineHeight: 20 },
});
