import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PressableScale from '../components/PressableScale';
import { colors, gradients, shadow } from '../theme';

function ModeCard({ title, subtitle, badge, colorsArr, icon, onPress }) {
  return (
    <PressableScale onPress={onPress} style={[styles.card, shadow]} scaleTo={0.97}>
      <LinearGradient colors={colorsArr} style={styles.cardGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.cardIconWrap}>
          <Text style={styles.cardIcon}>{icon}</Text>
        </View>
        <View style={styles.cardTextWrap}>
          <View style={styles.badgeRow}>
            <Text style={styles.badge}>{badge}</Text>
          </View>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </LinearGradient>
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
            Make your call first — the outcome is only revealed afterwards.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Beginner</Text>
        <ModeCard
          title="Coin Call"
          subtitle="Predict Heads or Tails"
          badge="LEVEL 1"
          icon="🪙"
          colorsArr={gradients.beginner}
          onPress={() => navigation.navigate('CoinFlip')}
        />

        <Text style={styles.sectionLabel}>Intermediate</Text>
        <ModeCard
          title="Hidden Ball"
          subtitle="Sense which box hides the ball"
          badge="LEVEL 2"
          icon="🎯"
          colorsArr={gradients.intermediate}
          onPress={() => navigation.navigate('BoxSelect')}
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
  hero: { marginTop: 12, marginBottom: 28 },
  eyebrow: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 22,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  card: {
    borderRadius: 24,
    marginBottom: 22,
    overflow: 'hidden',
  },
  cardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 24,
  },
  cardIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardIcon: { fontSize: 28 },
  cardTextWrap: { flex: 1 },
  badgeRow: { marginBottom: 4 },
  badge: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  cardTitle: { color: '#fff', fontSize: 19, fontWeight: '800' },
  cardSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 2 },
  chevron: { color: '#fff', fontSize: 28, fontWeight: '300', marginLeft: 6 },
  footerNote: {
    marginTop: 12,
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.surface,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
});
