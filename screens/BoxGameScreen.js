import { useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import PressableScale from '../components/PressableScale';
import ScoreBadge from '../components/ScoreBadge';
import { colors, shadow } from '../theme';

const REVEAL_DELAY = 650;

// A distinct wrapping colour per box so the row reads as a vibrant line-up.
const WRAPS = [
  { body: ['#7C6FF0', '#5A4ED6'], lid: ['#8E82F5', '#6B5EE8'], ribbon: '#FFE08A' },
  { body: ['#FF8FB1', '#F0568A'], lid: ['#FFA3C0', '#F76B9B'], ribbon: '#FFF3C4' },
  { body: ['#4FD1C5', '#2BB3A6'], lid: ['#6FE0D5', '#3FC6B8'], ribbon: '#FFE08A' },
  { body: ['#FDBA74', '#F59E42'], lid: ['#FFCB8E', '#FBAE58'], ribbon: '#FFF4D6' },
  { body: ['#A0C4FF', '#6B9BF0'], lid: ['#B6D2FF', '#80AEF5'], ribbon: '#FFE08A' },
];

export default function BoxGameScreen({ route }) {
  const { boxCount } = route.params;
  const [phase, setPhase] = useState('idle');
  const [selected, setSelected] = useState(null);
  const [ballIndex, setBallIndex] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  // One "lid lift" + one "ball pop" animated value per possible box.
  const lids = useRef(Array.from({ length: 5 }, () => new Animated.Value(0))).current;
  const balls = useRef(Array.from({ length: 5 }, () => new Animated.Value(0))).current;
  const nudge = useRef(new Animated.Value(0)).current; // selected-box wobble while sensing

  const boxSize = boxCount <= 3 ? 104 : boxCount === 4 ? 88 : 74;

  const handleSelect = (index) => {
    if (phase !== 'idle') return;
    setSelected(index);
    setBallIndex(null);
    setPhase('revealing');

    // Anticipation wobble on the chosen box.
    nudge.setValue(0);
    Animated.sequence([
      Animated.timing(nudge, { toValue: 1, duration: 110, useNativeDriver: true }),
      Animated.timing(nudge, { toValue: -1, duration: 110, useNativeDriver: true }),
      Animated.timing(nudge, { toValue: 1, duration: 110, useNativeDriver: true }),
      Animated.timing(nudge, { toValue: 0, duration: 110, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      // Ball position is randomised only now — strictly after the tap.
      const result = Math.floor(Math.random() * boxCount);
      setBallIndex(result);
      setTotal((t) => t + 1);
      setCorrect((c) => (result === index ? c + 1 : c));
      setPhase('result');

      // Every lid flies open; the ball under its slot springs up.
      Animated.stagger(
        70,
        Array.from({ length: boxCount }, (_, i) =>
          Animated.parallel([
            Animated.timing(lids[i], {
              toValue: 1,
              duration: 420,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.spring(balls[i], {
              toValue: 1,
              useNativeDriver: true,
              speed: 12,
              bounciness: 14,
            }),
          ])
        )
      ).start();
    }, REVEAL_DELAY);
  };

  const reset = () => {
    setPhase('idle');
    setSelected(null);
    setBallIndex(null);
    lids.forEach((v) => v.setValue(0));
    balls.forEach((v) => v.setValue(0));
  };

  const isCorrect = phase === 'result' && selected === ballIndex;
  const wobble = nudge.interpolate({ inputRange: [-1, 1], outputRange: ['-5deg', '5deg'] });

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#F7F9FF', '#EEF1FB']} style={StyleSheet.absoluteFill} />
      <View style={styles.container}>
        <Text style={styles.title}>{boxCount} Boxes</Text>
        <Text style={styles.subtitle}>Tap the box you sense the ball is hiding in.</Text>

        <ScoreBadge correct={correct} total={total} />

        <View style={styles.stageWrap}>
          <View style={styles.boxesRow}>
            {Array.from({ length: boxCount }).map((_, i) => {
              const wrap = WRAPS[i % WRAPS.length];
              const isSelected = selected === i;
              const isBall = phase === 'result' && ballIndex === i;

              const lidTranslate = lids[i].interpolate({
                inputRange: [0, 1],
                outputRange: [0, -boxSize * 1.15],
              });
              const lidRotate = lids[i].interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '-22deg'],
              });
              const lidOpacity = lids[i].interpolate({
                inputRange: [0, 0.7, 1],
                outputRange: [1, 1, 0],
              });
              const ballScale = balls[i].interpolate({
                inputRange: [0, 1],
                outputRange: [0.2, 1],
              });
              const ballRise = balls[i].interpolate({
                inputRange: [0, 1],
                outputRange: [boxSize * 0.3, -boxSize * 0.18],
              });

              return (
                <View key={i} style={[styles.slot, { width: boxSize, height: boxSize * 1.5 }]}>
                  {/* Floor shadow */}
                  <View
                    style={[
                      styles.floorShadow,
                      { width: boxSize * 0.78, bottom: boxSize * 0.12 },
                    ]}
                  />

                  {/* What's underneath: the ball, or an empty spot */}
                  <View style={styles.underLayer} pointerEvents="none">
                    {isBall ? (
                      <Animated.View
                        style={{
                          transform: [{ translateY: ballRise }, { scale: ballScale }],
                        }}
                      >
                        <GlossyBall size={boxSize * 0.62} />
                      </Animated.View>
                    ) : phase === 'result' ? (
                      <View
                        style={[
                          styles.emptyMark,
                          { width: boxSize * 0.5, height: boxSize * 0.5 },
                        ]}
                      />
                    ) : null}
                  </View>

                  {/* The wrapped box / lid */}
                  <PressableScale
                    disabled={phase !== 'idle'}
                    onPress={() => handleSelect(i)}
                    style={styles.lidPress}
                  >
                    <Animated.View
                      style={{
                        transform: [
                          { translateY: lidTranslate },
                          { rotate: isSelected ? wobble : '0deg' },
                          { rotateX: lidRotate },
                        ],
                        opacity: lidOpacity,
                      }}
                    >
                      <GiftBox
                        size={boxSize}
                        wrap={wrap}
                        highlighted={isSelected && phase !== 'result'}
                      />
                    </Animated.View>
                  </PressableScale>

                  <Text style={styles.slotLabel}>{i + 1}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.resultArea}>
          {phase === 'result' && (
            <Text style={[styles.resultText, isCorrect ? styles.resultGood : styles.resultBad]}>
              {isCorrect
                ? 'Direct hit! Your ESP nailed it. 🎉'
                : `The ball was in box ${ballIndex + 1}.`}
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

function GiftBox({ size, wrap, highlighted }) {
  const lidH = size * 0.26;
  return (
    <View style={[styles.giftWrap, highlighted && styles.giftHighlight]}>
      {/* Box body */}
      <LinearGradient
        colors={wrap.body}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: size,
          height: size,
          borderRadius: 14,
          marginTop: lidH * 0.5,
          ...shadow,
        }}
      >
        <View style={styles.boxSheen} pointerEvents="none" />
        {/* Vertical ribbon */}
        <View
          style={[
            styles.ribbonV,
            { backgroundColor: wrap.ribbon, left: size / 2 - size * 0.08, width: size * 0.16 },
          ]}
        />
      </LinearGradient>

      {/* Lid sitting on top, slightly wider */}
      <LinearGradient
        colors={wrap.lid}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          width: size * 1.12,
          height: lidH,
          borderRadius: 10,
          alignSelf: 'center',
        }}
      >
        {/* Horizontal ribbon across the lid */}
        <View
          style={[
            styles.ribbonH,
            { backgroundColor: wrap.ribbon, left: size * 0.56 - size * 0.08, width: size * 0.16 },
          ]}
        />
      </LinearGradient>

      {/* Bow */}
      <Text style={[styles.bow, { top: -lidH * 0.55 }]}>🎀</Text>
    </View>
  );
}

function GlossyBall({ size }) {
  return (
    <View style={{ width: size, height: size }}>
      <LinearGradient
        colors={['#FF7B7B', '#E63946', '#9E1B28']}
        start={{ x: 0.25, y: 0.15 }}
        end={{ x: 0.8, y: 0.95 }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          ...shadow,
          shadowOpacity: 0.3,
        }}
      >
        {/* Bright specular highlight */}
        <View
          style={{
            position: 'absolute',
            top: size * 0.14,
            left: size * 0.18,
            width: size * 0.32,
            height: size * 0.32,
            borderRadius: size * 0.16,
            backgroundColor: 'rgba(255,255,255,0.75)',
          }}
        />
        {/* Soft secondary glow */}
        <View
          style={{
            position: 'absolute',
            top: size * 0.1,
            left: size * 0.12,
            width: size * 0.5,
            height: size * 0.5,
            borderRadius: size * 0.25,
            backgroundColor: 'rgba(255,255,255,0.18)',
          }}
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: colors.text, marginTop: 8 },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 4, textAlign: 'center' },
  stageWrap: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' },
  boxesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 16,
    width: '100%',
  },
  slot: { alignItems: 'center', justifyContent: 'flex-end' },
  floorShadow: {
    position: 'absolute',
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(27,31,59,0.16)',
  },
  underLayer: {
    position: 'absolute',
    bottom: 0,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: '14%',
  },
  emptyMark: {
    borderRadius: 999,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(27,31,59,0.18)',
  },
  lidPress: { alignItems: 'center', justifyContent: 'flex-end' },
  giftWrap: { alignItems: 'center' },
  giftHighlight: {
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  boxSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: '55%',
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  ribbonV: { position: 'absolute', top: 0, bottom: 0 },
  ribbonH: { position: 'absolute', top: 0, bottom: 0 },
  bow: { position: 'absolute', left: 0, right: 0, textAlign: 'center', fontSize: 26, zIndex: 2 },
  slotLabel: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '800',
    color: colors.textMuted,
  },
  resultArea: { minHeight: 46, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  resultText: { fontSize: 15, fontWeight: '800', textAlign: 'center' },
  resultGood: { color: colors.success },
  resultBad: { color: colors.danger },
  againBtn: {
    marginTop: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 18,
  },
  againText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
