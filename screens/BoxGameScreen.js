import { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PressableScale from '../components/PressableScale';
import ScoreBadge from '../components/ScoreBadge';
import { colors, shadow } from '../theme';

const REVEAL_DELAY = 700;

export default function BoxGameScreen({ route }) {
  const { boxCount } = route.params;
  const [phase, setPhase] = useState('idle');
  const [selected, setSelected] = useState(null);
  const [ballIndex, setBallIndex] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const bounce = useRef(new Animated.Value(0)).current;
  const pops = useRef(Array.from({ length: 5 }, () => new Animated.Value(1))).current;

  const handleSelect = (index) => {
    if (phase === 'revealing') return;
    setSelected(index);
    setBallIndex(null);
    setPhase('revealing');
    bounce.setValue(0);

    Animated.sequence([
      Animated.timing(bounce, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(bounce, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      // Ball position is randomized only now, strictly after the tap above.
      const result = Math.floor(Math.random() * boxCount);
      setBallIndex(result);
      setTotal((t) => t + 1);
      setCorrect((c) => (result === index ? c + 1 : c));
      setPhase('result');
      pops[result].setValue(0.5);
      Animated.spring(pops[result], {
        toValue: 1,
        useNativeDriver: true,
        speed: 14,
        bounciness: 12,
      }).start();
    }, REVEAL_DELAY);
  };

  const reset = () => {
    setPhase('idle');
    setSelected(null);
    setBallIndex(null);
  };

  const isCorrect = phase === 'result' && selected === ballIndex;
  const boxSize = boxCount <= 3 ? 92 : boxCount === 4 ? 80 : 68;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>{boxCount} Boxes</Text>
        <Text style={styles.subtitle}>Tap the box you sense the ball is under.</Text>

        <ScoreBadge correct={correct} total={total} />

        <View style={styles.boxesRow}>
          {Array.from({ length: boxCount }).map((_, i) => {
            const isSelected = selected === i;
            const isBall = phase === 'result' && ballIndex === i;
            const scale =
              isSelected && phase === 'revealing'
                ? bounce.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] })
                : isBall
                ? pops[i]
                : 1;

            return (
              <PressableScale
                key={i}
                disabled={phase === 'revealing'}
                onPress={() => handleSelect(i)}
                style={[
                  styles.box,
                  shadow,
                  { width: boxSize, height: boxSize },
                  isSelected && styles.boxSelected,
                  phase === 'result' && isBall && styles.boxBall,
                  phase === 'result' && isSelected && !isBall && styles.boxMissed,
                ]}
              >
                <Animated.Text
                  style={[styles.boxEmoji, { fontSize: boxSize * 0.42, transform: [{ scale }] }]}
                >
                  {phase === 'result' && isBall ? '🟡' : '📦'}
                </Animated.Text>
                <Text style={styles.boxLabel}>{i + 1}</Text>
              </PressableScale>
            );
          })}
        </View>

        <View style={styles.resultArea}>
          {phase === 'result' && (
            <Text style={[styles.resultText, isCorrect ? styles.resultGood : styles.resultBad]}>
              {isCorrect
                ? 'Direct hit! Your ESP nailed it. 🎉'
                : `Ball was under box ${ballIndex + 1}.`}
            </Text>
          )}
        </View>

        {phase === 'result' && (
          <PressableScale onPress={reset} style={[styles.againBtn, shadow]}>
            <Text style={styles.againText}>Play Again</Text>
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
  boxesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
    marginVertical: 24,
    width: '100%',
  },
  box: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  boxSelected: { borderColor: colors.primary },
  boxBall: { borderColor: colors.success, backgroundColor: '#ECFDF5' },
  boxMissed: { borderColor: colors.danger, backgroundColor: '#FEF2F2' },
  boxEmoji: {},
  boxLabel: { position: 'absolute', bottom: 4, right: 8, fontSize: 10, color: colors.textMuted, fontWeight: '700' },
  resultArea: { minHeight: 50, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  resultText: { fontSize: 15, fontWeight: '700', textAlign: 'center' },
  resultGood: { color: colors.success },
  resultBad: { color: colors.danger },
  againBtn: {
    marginTop: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 18,
  },
  againText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
