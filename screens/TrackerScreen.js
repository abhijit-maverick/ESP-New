import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import PressableScale from '../components/PressableScale';
import { useStats } from '../store/StatsContext';
import { colors, shadow } from '../theme';

const GAME_META = {
  coin: { name: 'Coin Call', icon: '🪙', chance: 50 },
  box3: { name: '3 Boxes', icon: '🎁', chance: 33 },
  zener: { name: 'Zener Symbols', icon: '🔮', chance: 20 },
  box5: { name: '5 Boxes', icon: '🎁', chance: 20 },
};
const GAME_ORDER = ['coin', 'box3', 'zener', 'box5'];

function pct(correct, attempts) {
  return attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
}

export default function TrackerScreen() {
  const { stats, resetAll } = useStats();
  const { overall, games, recent } = stats;
  const accuracy = pct(overall.correct, overall.attempts);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#6C5CE7', '#8E82F5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, shadow]}
        >
          <Text style={styles.heroStreak}>🔥 {overall.currentStreak}</Text>
          <Text style={styles.heroStreakLabel}>Current win streak</Text>
          <View style={styles.heroRow}>
            <View style={styles.heroItem}>
              <Text style={styles.heroValue}>⭐ {overall.bestStreak}</Text>
              <Text style={styles.heroLabel}>Best streak</Text>
            </View>
            <View style={styles.heroItem}>
              <Text style={styles.heroValue}>{accuracy}%</Text>
              <Text style={styles.heroLabel}>Accuracy</Text>
            </View>
            <View style={styles.heroItem}>
              <Text style={styles.heroValue}>{overall.attempts}</Text>
              <Text style={styles.heroLabel}>Attempts</Text>
            </View>
          </View>
        </LinearGradient>

        <Text style={styles.sectionLabel}>Recent Calls</Text>
        <View style={[styles.recentCard, shadow]}>
          {recent.length === 0 ? (
            <Text style={styles.emptyText}>No calls yet — play a level to start your streak.</Text>
          ) : (
            <View style={styles.dotRow}>
              {recent
                .slice(-20)
                .map((hit, i) => (
                  <View
                    key={i}
                    style={[styles.dot, hit ? styles.dotHit : styles.dotMiss]}
                  />
                ))}
            </View>
          )}
          <Text style={styles.recentHint}>Newest on the right · green = hit</Text>
        </View>

        <Text style={styles.sectionLabel}>By Level</Text>
        {GAME_ORDER.map((key) => {
          const g = games[key];
          const meta = GAME_META[key];
          const acc = pct(g.correct, g.attempts);
          const beating = acc - meta.chance;
          return (
            <View key={key} style={[styles.gameCard, shadow]}>
              <Text style={styles.gameIcon}>{meta.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.gameName}>{meta.name}</Text>
                <Text style={styles.gameMeta}>
                  {g.correct}/{g.attempts} hits · best 🔥{g.bestStreak}
                </Text>
              </View>
              <View style={styles.gameRight}>
                <Text style={styles.gameAcc}>{acc}%</Text>
                {g.attempts > 0 && (
                  <Text
                    style={[
                      styles.gameDelta,
                      beating >= 0 ? styles.deltaUp : styles.deltaDown,
                    ]}
                  >
                    {beating >= 0 ? '▲' : '▼'} {Math.abs(beating)}% vs chance
                  </Text>
                )}
              </View>
            </View>
          );
        })}

        <View style={[styles.insightCard, shadow]}>
          <Text style={styles.insightTitle}>How to read this</Text>
          <Text style={styles.insightText}>
            "vs chance" compares your accuracy to pure luck. Consistently staying above chance
            across many attempts is the signature of real ESP — single rounds will swing wildly,
            so look at the long-run trend.
          </Text>
        </View>

        <PressableScale onPress={resetAll} style={styles.resetBtn} scaleTo={0.97}>
          <Text style={styles.resetText}>Reset all stats</Text>
        </PressableScale>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  hero: { borderRadius: 24, padding: 22, alignItems: 'center', marginBottom: 8 },
  heroStreak: { color: '#fff', fontSize: 46, fontWeight: '900' },
  heroStreakLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '600', marginBottom: 16 },
  heroRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-around' },
  heroItem: { alignItems: 'center' },
  heroValue: { color: '#fff', fontSize: 20, fontWeight: '800' },
  heroLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginTop: 22,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  recentCard: { backgroundColor: colors.surface, borderRadius: 18, padding: 16 },
  dotRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  dot: { width: 16, height: 16, borderRadius: 8 },
  dotHit: { backgroundColor: colors.success },
  dotMiss: { backgroundColor: '#E5E7EB' },
  recentHint: { fontSize: 11, color: colors.textMuted, marginTop: 10 },
  emptyText: { fontSize: 14, color: colors.textMuted, textAlign: 'center', paddingVertical: 8 },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  gameIcon: { fontSize: 28, marginRight: 14 },
  gameName: { fontSize: 16, fontWeight: '800', color: colors.text },
  gameMeta: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  gameRight: { alignItems: 'flex-end' },
  gameAcc: { fontSize: 20, fontWeight: '800', color: colors.text },
  gameDelta: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  deltaUp: { color: colors.success },
  deltaDown: { color: colors.textMuted },
  insightCard: { backgroundColor: '#EEF0FB', borderRadius: 18, padding: 16, marginTop: 10 },
  insightTitle: { fontSize: 14, fontWeight: '800', color: colors.text, marginBottom: 6 },
  insightText: { fontSize: 13, color: colors.textMuted, lineHeight: 20 },
  resetBtn: {
    marginTop: 22,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  resetText: { color: colors.danger, fontWeight: '700', fontSize: 14 },
});
