import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PressableScale from '../components/PressableScale';
import { useStats } from '../store/StatsContext';
import { colors, shadow } from '../theme';

function StreakBanner() {
  const { stats } = useStats();
  const { currentStreak, bestStreak, attempts, correct } = stats.overall;
  const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
  return (
    <LinearGradient
      colors={['#6C5CE7', '#8E82F5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.banner, shadow]}
    >
      <View style={styles.bannerItem}>
        <Text style={styles.bannerValue}>🔥 {currentStreak}</Text>
        <Text style={styles.bannerLabel}>Streak</Text>
      </View>
      <View style={styles.bannerDivider} />
      <View style={styles.bannerItem}>
        <Text style={styles.bannerValue}>⭐ {bestStreak}</Text>
        <Text style={styles.bannerLabel}>Best</Text>
      </View>
      <View style={styles.bannerDivider} />
      <View style={styles.bannerItem}>
        <Text style={styles.bannerValue}>{accuracy}%</Text>
        <Text style={styles.bannerLabel}>Accuracy</Text>
      </View>
    </LinearGradient>
  );
}

function ModeCard({ title, subtitle, badge, colorsArr, icon, onPress }) {
  return (
    <PressableScale onPress={onPress} style={[styles.card, shadow]} scaleTo={0.97}>
      <LinearGradient colors={colorsArr} style={styles.cardGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.cardIconWrap}>
          <Text style={styles.cardIcon}>{icon}</Text>
        </View>
        <View style={styles.cardTextWrap}>
          <Text style={styles.badge}>{badge}</Text>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </LinearGradient>
    </PressableScale>
  );
}

function ToolCard({ title, subtitle, icon, onPress }) {
  return (
    <PressableScale onPress={onPress} style={[styles.tool, shadow]} scaleTo={0.97}>
      <Text style={styles.toolIcon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.toolTitle}>{title}</Text>
        <Text style={styles.toolSubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.toolChevron}>›</Text>
    </PressableScale>
  );
}

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>MIND TRAINING</Text>
          <Text style={styles.title}>ESP Trainer</Text>
          <Text style={styles.subtitle}>
            Sharpen your extrasensory perception with focused intuition drills.
          </Text>
        </View>

        <StreakBanner />

        <Text style={styles.sectionLabel}>Levels · Easy to Hard</Text>

        <ModeCard
          title="Coin Call"
          subtitle="1 in 2 · Predict Heads or Tails"
          badge="BEGINNER"
          icon="🪙"
          colorsArr={['#43CBFF', '#9708CC']}
          onPress={() => navigation.navigate('CoinFlip')}
        />
        <ModeCard
          title="Hidden Ball · 3 Boxes"
          subtitle="1 in 3 · Sense where the ball rests"
          badge="EASY"
          icon="🎁"
          colorsArr={['#FF9A8B', '#FF6A88']}
          onPress={() => navigation.navigate('BoxGame', { boxCount: 3 })}
        />
        <ModeCard
          title="Zener Symbols"
          subtitle="1 in 5 · The classic ESP card test"
          badge="MEDIUM"
          icon="🔮"
          colorsArr={['#A18CD1', '#FBC2EB']}
          onPress={() => navigation.navigate('Zener')}
        />
        <ModeCard
          title="Hidden Ball · 5 Boxes"
          subtitle="1 in 5 · Find the ball among five"
          badge="HARD"
          icon="🎁"
          colorsArr={['#5A4ED6', '#7C6FF0']}
          onPress={() => navigation.navigate('BoxGame', { boxCount: 5 })}
        />

        <Text style={styles.sectionLabel}>Your Practice</Text>

        <ToolCard
          title="ESP Tracker"
          subtitle="Streaks, accuracy & progress"
          icon="📈"
          onPress={() => navigation.navigate('Tracker')}
        />
        <ToolCard
          title="Train Your ESP"
          subtitle="A step-by-step learning module"
          icon="📚"
          onPress={() => navigation.navigate('Learn')}
        />

        <View style={styles.footerNote}>
          <Text style={styles.footerText}>
            Tip: Relax, breathe, and trust your first instinct before you tap.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  hero: { marginTop: 12, marginBottom: 18 },
  eyebrow: { color: colors.primary, fontWeight: '800', fontSize: 12, letterSpacing: 1.5, marginBottom: 6 },
  title: { fontSize: 34, fontWeight: '800', color: colors.text, marginBottom: 10 },
  subtitle: { fontSize: 15, color: colors.textMuted, lineHeight: 22 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 10,
    marginBottom: 26,
  },
  bannerItem: { flex: 1, alignItems: 'center' },
  bannerValue: { color: '#fff', fontSize: 22, fontWeight: '800' },
  bannerLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '600', marginTop: 2 },
  bannerDivider: { width: 1, height: 34, backgroundColor: 'rgba(255,255,255,0.3)' },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  card: { borderRadius: 22, marginBottom: 16, overflow: 'hidden' },
  cardGradient: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 22 },
  cardIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardIcon: { fontSize: 26 },
  cardTextWrap: { flex: 1 },
  badge: { color: 'rgba(255,255,255,0.92)', fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 3 },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  cardSubtitle: { color: 'rgba(255,255,255,0.92)', fontSize: 13, marginTop: 2 },
  chevron: { color: '#fff', fontSize: 28, fontWeight: '300', marginLeft: 6 },
  tool: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  toolIcon: { fontSize: 26, marginRight: 14 },
  toolTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  toolSubtitle: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  toolChevron: { color: colors.textMuted, fontSize: 26, fontWeight: '300' },
  footerNote: { marginTop: 10, padding: 16, borderRadius: 18, backgroundColor: colors.surface },
  footerText: { color: colors.textMuted, fontSize: 13, textAlign: 'center', lineHeight: 19 },
});
