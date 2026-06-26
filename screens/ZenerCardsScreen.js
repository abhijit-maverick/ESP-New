import { useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import PressableScale from '../components/PressableScale';
import ScoreBadge from '../components/ScoreBadge';
import { useStats } from '../store/StatsContext';
import { colors, shadow } from '../theme';

// The five classic Zener symbols used in J. B. Rhine's ESP experiments.
const SYMBOLS = [
  { key: 'circle', glyph: '◯', name: 'Circle' },
  { key: 'cross', glyph: '✚', name: 'Cross' },
  { key: 'waves', glyph: '≋', name: 'Waves' },
  { key: 'square', glyph: '▢', name: 'Square' },
  { key: 'star', glyph: '★', name: 'Star' },
];

const randomCard = () => Math.floor(Math.random() * SYMBOLS.length);

export default function ZenerCardsScreen() {
  const { recordResult } = useStats();
  const [phase, setPhase] = useState('idle'); // idle | result
  const [guess, setGuess] = useState(null);
  // The card is already drawn and lying face-down before you choose.
  const [card, setCard] = useState(randomCard);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const flip = useRef(new Animated.Value(0)).current; // 0 = back, 1 = face

  const scaleX = flip.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0.06, 1] });
  const backOpacity = flip.interpolate({ inputRange: [0, 0.49, 0.5, 1], outputRange: [1, 1, 0, 0] });
  const faceOpacity = flip.interpolate({ inputRange: [0, 0.5, 0.51, 1], outputRange: [0, 0, 1, 1] });

  const handleGuess = (index) => {
    if (phase !== 'idle') return;
    const won = index === card;
    setGuess(index);
    setTotal((t) => t + 1);
    setCorrect((c) => (won ? c + 1 : c));
    recordResult('zener', won);

    flip.setValue(0);
    Animated.timing(flip, {
      toValue: 1,
      duration: 560,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start(() => setPhase('result'));
  };

  const reset = () => {
    setPhase('idle');
    setGuess(null);
    setCard(randomCard());
    flip.setValue(0);
  };

  const isCorrect = phase === 'result' && guess === card;

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#F7F9FF', '#EEF1FB']} style={StyleSheet.absoluteFill} />
      <View style={styles.container}>
        <Text style={styles.title}>Zener Symbols</Text>
        <Text style={styles.subtitle}>
          A card is face-down. Sense the symbol, then tap your choice.
        </Text>

        <ScoreBadge correct={correct} total={total} />

        <View style={styles.cardArea}>
          <Animated.View style={[styles.card, shadow, { transform: [{ perspective: 900 }, { scaleX }] }]}>
            {/* Back of the card */}
            <Animated.View style={[styles.cardFace, { opacity: backOpacity }]}>
              <LinearGradient colors={['#6C5CE7', '#8E82F5']} style={styles.cardBack}>
                <View style={styles.backInner}>
                  <Text style={styles.backGlyph}>✶</Text>
                </View>
              </LinearGradient>
            </Animated.View>

            {/* Face with the revealed symbol */}
            <Animated.View style={[styles.cardFace, styles.cardFaceTop, { opacity: faceOpacity }]}>
              <View
                style={[
                  styles.cardFront,
                  isCorrect && styles.cardFrontHit,
                  phase === 'result' && !isCorrect && styles.cardFrontMiss,
                ]}
              >
                <Text style={styles.frontGlyph}>{SYMBOLS[card].glyph}</Text>
                <Text style={styles.frontName}>{SYMBOLS[card].name}</Text>
              </View>
            </Animated.View>
          </Animated.View>

          {phase === 'result' && (
            <Text style={[styles.verdict, isCorrect ? styles.good : styles.bad]}>
              {isCorrect ? 'Hit! Spot on. 🎉' : `It was the ${SYMBOLS[card].name}.`}
            </Text>
          )}
        </View>

        <View style={styles.palette}>
          {SYMBOLS.map((s, i) => {
            const chosen = guess === i;
            const reveal = phase === 'result';
            return (
              <PressableScale
                key={s.key}
                disabled={phase !== 'idle'}
                onPress={() => handleGuess(i)}
                style={[
                  styles.symBtn,
                  shadow,
                  chosen && phase !== 'result' && styles.symBtnActive,
                  reveal && i === card && styles.symBtnCorrect,
                  reveal && chosen && i !== card && styles.symBtnWrong,
                ]}
                scaleTo={0.92}
              >
                <Text style={styles.symGlyph}>{s.glyph}</Text>
              </PressableScale>
            );
          })}
        </View>

        {phase === 'result' && (
          <PressableScale onPress={reset} style={[styles.againBtn, shadow]}>
            <Text style={styles.againText}>Next Card</Text>
          </PressableScale>
        )}
      </View>
    </SafeAreaView>
  );
}

const CARD_W = 150;
const CARD_H = 200;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: colors.text, marginTop: 8 },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 4, textAlign: 'center' },
  cardArea: { flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' },
  card: { width: CARD_W, height: CARD_H },
  cardFace: { ...StyleSheet.absoluteFillObject },
  cardFaceTop: {},
  cardBack: {
    flex: 1,
    borderRadius: 18,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  backInner: {
    flex: 1,
    alignSelf: 'stretch',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.45)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backGlyph: { fontSize: 56, color: 'rgba(255,255,255,0.92)' },
  cardFront: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.border,
  },
  cardFrontHit: { borderColor: colors.success, backgroundColor: '#ECFDF5' },
  cardFrontMiss: { borderColor: colors.danger, backgroundColor: '#FEF2F2' },
  frontGlyph: { fontSize: 84, color: colors.text },
  frontName: { fontSize: 15, fontWeight: '800', color: colors.textMuted, marginTop: 6, letterSpacing: 1 },
  verdict: { position: 'absolute', bottom: 6, fontSize: 15, fontWeight: '800' },
  good: { color: colors.success },
  bad: { color: colors.danger },
  palette: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  symBtn: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  symBtnActive: { borderColor: colors.primary },
  symBtnCorrect: { borderColor: colors.success, backgroundColor: '#ECFDF5' },
  symBtnWrong: { borderColor: colors.danger, backgroundColor: '#FEF2F2' },
  symGlyph: { fontSize: 30, color: colors.text },
  againBtn: {
    marginTop: 14,
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 18,
  },
  againText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
