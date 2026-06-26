import { useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import PressableScale from '../components/PressableScale';
import ScoreBadge from '../components/ScoreBadge';
import { colors, gradients, shadow } from '../theme';

const FLIP_DURATION = 900;

export default function CoinFlipScreen() {
  const [phase, setPhase] = useState('idle');
  const [guess, setGuess] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const spin = useRef(new Animated.Value(0)).current;
  const popIn = useRef(new Animated.Value(0)).current;

  const rotateY = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '1800deg'],
  });

  const handleGuess = (choice) => {
    if (phase === 'flipping') return;
    setGuess(choice);
    setOutcome(null);
    setPhase('flipping');
    spin.setValue(0);
    popIn.setValue(0);

    Animated.timing(spin, {
      toValue: 1,
      duration: FLIP_DURATION,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      // Outcome is generated only now, after the flip animation completes
      // and strictly after the user already committed to a guess.
      const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
      setOutcome(result);
      setTotal((t) => t + 1);
      setCorrect((c) => (result === choice ? c + 1 : c));
      setPhase('result');
      Animated.spring(popIn, {
        toValue: 1,
        useNativeDriver: true,
        speed: 14,
        bounciness: 10,
      }).start();
    });
  };

  const reset = () => {
    setPhase('idle');
    setGuess(null);
    setOutcome(null);
  };

  const isCorrect = outcome && guess === outcome;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Coin Call</Text>
        <Text style={styles.subtitle}>Choose Heads or Tails, then trust your gut.</Text>

        <ScoreBadge correct={correct} total={total} />

        <View style={styles.coinArea}>
          <Animated.View style={[styles.coin, shadow, { transform: [{ rotateY }] }]}>
            <LinearGradient colors={gradients.beginner} style={styles.coinFace}>
              <Text style={styles.coinText}>
                {phase === 'flipping' ? '...' : phase === 'result' ? outcome : '?'}
              </Text>
            </LinearGradient>
          </Animated.View>

          {phase === 'result' && (
            <Animated.View
              style={[
                styles.resultPill,
                isCorrect ? styles.resultGood : styles.resultBad,
                { transform: [{ scale: popIn }] },
              ]}
            >
              <Text style={styles.resultPillText}>
                {isCorrect ? 'Your ESP was right! 🎉' : `It was ${outcome}`}
              </Text>
            </Animated.View>
          )}
        </View>

        <View style={styles.choiceRow}>
          <PressableScale
            disabled={phase === 'flipping'}
            onPress={() => handleGuess('Heads')}
            style={[
              styles.choiceBtn,
              shadow,
              guess === 'Heads' && phase !== 'idle' && styles.choiceBtnActive,
            ]}
          >
            <Text style={styles.choiceIcon}>🙂</Text>
            <Text style={styles.choiceText}>Heads</Text>
          </PressableScale>
          <PressableScale
            disabled={phase === 'flipping'}
            onPress={() => handleGuess('Tails')}
            style={[
              styles.choiceBtn,
              shadow,
              guess === 'Tails' && phase !== 'idle' && styles.choiceBtnActive,
            ]}
          >
            <Text style={styles.choiceIcon}>🦅</Text>
            <Text style={styles.choiceText}>Tails</Text>
          </PressableScale>
        </View>

        {phase === 'result' && (
          <PressableScale onPress={reset} style={[styles.againBtn, shadow]}>
            <Text style={styles.againText}>Call Again</Text>
          </PressableScale>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, marginTop: 8 },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 4, textAlign: 'center' },
  coinArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  coin: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  coinFace: {
    flex: 1,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  coinText: { fontSize: 24, fontWeight: '800', color: '#fff' },
  resultPill: {
    marginTop: 26,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  resultGood: { backgroundColor: '#D1FAE5' },
  resultBad: { backgroundColor: '#FEE2E2' },
  resultPillText: { fontWeight: '700', color: colors.text },
  choiceRow: { flexDirection: 'row', gap: 16, marginBottom: 8, width: '100%' },
  choiceBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 22,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  choiceBtnActive: { borderColor: colors.primary },
  choiceIcon: { fontSize: 30, marginBottom: 6 },
  choiceText: { fontWeight: '700', color: colors.text, fontSize: 15 },
  againBtn: {
    marginTop: 16,
    marginBottom: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 18,
  },
  againText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
