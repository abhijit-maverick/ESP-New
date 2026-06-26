import { useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import PressableScale from '../components/PressableScale';
import ScoreBadge from '../components/ScoreBadge';
import { colors, shadow } from '../theme';

const COIN_SIZE = 180;
const TOSS_DURATION = 1150;
const SETTLE_DURATION = 360;

// Half-turns the coin completes during the main toss. Even number => lands
// Heads-up by construction. An extra half-turn is added later only if the
// (post-selection) outcome is Tails.
const HALF_TURNS = 6;
const TURN_RATE = HALF_TURNS * 180; // degrees per unit of `flip`
const SAMPLES = 72;
const FLIP_MAX = 1 + 1 / HALF_TURNS; // value that lands the coin Tails-up

// Pre-compute a smooth |cos| squash profile and per-face visibility so the
// coin reads like a real spinning disc rather than a flat rotating card.
const inputRange = Array.from({ length: SAMPLES + 1 }, (_, i) => (i / SAMPLES) * FLIP_MAX);
const scaleYRange = inputRange.map((t) =>
  Math.max(0.08, Math.abs(Math.cos((Math.PI * TURN_RATE * t) / 180)))
);
const headsOpacityRange = inputRange.map((t) =>
  Math.cos((Math.PI * TURN_RATE * t) / 180) >= 0 ? 1 : 0
);
const tailsOpacityRange = headsOpacityRange.map((v) => (v === 1 ? 0 : 1));

export default function CoinFlipScreen() {
  const [phase, setPhase] = useState('idle');
  const [guess, setGuess] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const flip = useRef(new Animated.Value(0)).current; // 0..FLIP_MAX
  const lift = useRef(new Animated.Value(0)).current; // 0 ground -> 1 apex
  const popIn = useRef(new Animated.Value(0)).current; // result pill

  const scaleY = flip.interpolate({ inputRange, outputRange: scaleYRange });
  const headsOpacity = flip.interpolate({ inputRange, outputRange: headsOpacityRange });
  const tailsOpacity = flip.interpolate({ inputRange, outputRange: tailsOpacityRange });
  const translateY = lift.interpolate({ inputRange: [0, 1], outputRange: [0, -120] });
  const shadowScale = lift.interpolate({ inputRange: [0, 1], outputRange: [1, 0.55] });
  const shadowOpacity = lift.interpolate({ inputRange: [0, 1], outputRange: [0.28, 0.08] });

  const handleGuess = (choice) => {
    if (phase === 'flipping') return;
    setGuess(choice);
    setOutcome(null);
    setPhase('flipping');
    flip.setValue(0);
    lift.setValue(0);
    popIn.setValue(0);

    Animated.parallel([
      Animated.timing(flip, {
        toValue: 1,
        duration: TOSS_DURATION,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(lift, {
          toValue: 1,
          duration: TOSS_DURATION * 0.45,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(lift, {
          toValue: 0,
          duration: TOSS_DURATION * 0.55,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Outcome is generated only now — strictly after the user committed to a
      // guess AND after the visible toss has played out.
      const result = Math.random() < 0.5 ? 'Heads' : 'Tails';

      const settle = () => {
        setOutcome(result);
        setTotal((t) => t + 1);
        setCorrect((c) => (result === choice ? c + 1 : c));
        setPhase('result');
        Animated.spring(popIn, {
          toValue: 1,
          useNativeDriver: true,
          speed: 13,
          bounciness: 11,
        }).start();
      };

      if (result === 'Tails') {
        // One more crisp half-flip to land Tails-up.
        Animated.timing(flip, {
          toValue: FLIP_MAX,
          duration: SETTLE_DURATION,
          easing: Easing.out(Easing.back(1.4)),
          useNativeDriver: true,
        }).start(settle);
      } else {
        settle();
      }
    });
  };

  const reset = () => {
    setPhase('idle');
    setGuess(null);
    setOutcome(null);
    flip.setValue(0);
    lift.setValue(0);
  };

  const isCorrect = outcome && guess === outcome;

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#F7F9FF', '#EEF1FB']} style={StyleSheet.absoluteFill} />
      <View style={styles.container}>
        <Text style={styles.title}>Coin Call</Text>
        <Text style={styles.subtitle}>Choose Heads or Tails, then trust your gut.</Text>

        <ScoreBadge correct={correct} total={total} />

        <View style={styles.coinArea}>
          <View style={styles.stage}>
            {/* Ground shadow */}
            <Animated.View
              style={[
                styles.groundShadow,
                { opacity: shadowOpacity, transform: [{ scaleX: shadowScale }] },
              ]}
            />

            {/* The coin */}
            <Animated.View
              style={[
                styles.coin,
                { transform: [{ perspective: 900 }, { translateY }, { scaleY }] },
              ]}
            >
              {/* Tails face (silver) sits underneath */}
              <Animated.View style={[styles.face, { opacity: tailsOpacity }]}>
                <CoinFace
                  rim={['#F4F6FA', '#C7D0DD', '#9AA6B6']}
                  field={['#FBFCFE', '#D7DEE8', '#AEB8C6']}
                  emblem="🦅"
                  label="TAILS"
                  labelColor="#5B6675"
                />
              </Animated.View>
              {/* Heads face (gold) on top */}
              <Animated.View style={[styles.face, styles.faceTop, { opacity: headsOpacity }]}>
                <CoinFace
                  rim={['#FCE7A1', '#E9C24A', '#B8860B']}
                  field={['#FFF6CF', '#F4D679', '#D8A92B']}
                  emblem="👑"
                  label="HEADS"
                  labelColor="#8A6312"
                />
              </Animated.View>
            </Animated.View>
          </View>

          {phase === 'result' && (
            <Animated.View
              style={[
                styles.resultPill,
                isCorrect ? styles.resultGood : styles.resultBad,
                { transform: [{ scale: popIn }] },
              ]}
            >
              <Text style={styles.resultPillText}>
                {isCorrect ? 'Your ESP was right! 🎉' : `It landed ${outcome}`}
              </Text>
            </Animated.View>
          )}
        </View>

        <View style={styles.choiceRow}>
          <ChoiceButton
            label="Heads"
            emoji="👑"
            gradient={['#FCE7A1', '#E9C24A']}
            active={guess === 'Heads' && phase !== 'idle'}
            disabled={phase === 'flipping'}
            onPress={() => handleGuess('Heads')}
          />
          <ChoiceButton
            label="Tails"
            emoji="🦅"
            gradient={['#E8EDF4', '#C2CCDA']}
            active={guess === 'Tails' && phase !== 'idle'}
            disabled={phase === 'flipping'}
            onPress={() => handleGuess('Tails')}
          />
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

function CoinFace({ rim, field, emblem, label, labelColor }) {
  return (
    <LinearGradient
      colors={rim}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.coinRim}
    >
      <LinearGradient
        colors={field}
        start={{ x: 0.2, y: 0.1 }}
        end={{ x: 0.85, y: 0.95 }}
        style={styles.coinField}
      >
        {/* Glossy sheen sweeping across the metal */}
        <View style={styles.sheen} pointerEvents="none" />
        <Text style={styles.coinEmblem}>{emblem}</Text>
        <Text style={[styles.coinLabel, { color: labelColor }]}>{label}</Text>
      </LinearGradient>
    </LinearGradient>
  );
}

function ChoiceButton({ label, emoji, gradient, active, disabled, onPress }) {
  return (
    <PressableScale
      disabled={disabled}
      onPress={onPress}
      style={[styles.choiceBtn, shadow, active && styles.choiceBtnActive]}
    >
      <LinearGradient colors={gradient} style={styles.choiceCoin}>
        <Text style={styles.choiceEmoji}>{emoji}</Text>
      </LinearGradient>
      <Text style={styles.choiceText}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: colors.text, marginTop: 8 },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 4, textAlign: 'center' },
  coinArea: { flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' },
  stage: {
    width: COIN_SIZE + 40,
    height: COIN_SIZE + 150,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 24,
  },
  groundShadow: {
    position: 'absolute',
    bottom: 14,
    width: COIN_SIZE * 0.8,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#1B1F3B',
  },
  coin: { width: COIN_SIZE, height: COIN_SIZE },
  face: { ...StyleSheet.absoluteFillObject },
  faceTop: {},
  coinRim: {
    flex: 1,
    borderRadius: COIN_SIZE / 2,
    padding: 8,
    ...shadow,
    shadowOpacity: 0.22,
    shadowRadius: 18,
  },
  coinField: {
    flex: 1,
    borderRadius: COIN_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.55)',
    overflow: 'hidden',
  },
  sheen: {
    position: 'absolute',
    top: -COIN_SIZE * 0.25,
    left: -COIN_SIZE * 0.15,
    width: COIN_SIZE * 0.7,
    height: COIN_SIZE * 1.4,
    backgroundColor: 'rgba(255,255,255,0.35)',
    transform: [{ rotate: '25deg' }],
    borderRadius: COIN_SIZE,
  },
  coinEmblem: { fontSize: 64 },
  coinLabel: { fontSize: 15, fontWeight: '900', letterSpacing: 3, marginTop: 2 },
  resultPill: {
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 22,
    ...shadow,
    shadowOpacity: 0.1,
  },
  resultGood: { backgroundColor: '#D1FAE5' },
  resultBad: { backgroundColor: '#FEE2E2' },
  resultPillText: { fontWeight: '800', color: colors.text, fontSize: 15 },
  choiceRow: { flexDirection: 'row', gap: 16, marginBottom: 8, width: '100%' },
  choiceBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 22,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  choiceBtnActive: { borderColor: colors.primary },
  choiceCoin: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  choiceEmoji: { fontSize: 26 },
  choiceText: { fontWeight: '800', color: colors.text, fontSize: 15 },
  againBtn: {
    marginTop: 16,
    marginBottom: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 18,
  },
  againText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
