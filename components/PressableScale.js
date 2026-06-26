import { useRef } from 'react';
import { Animated, Pressable } from 'react-native';

export default function PressableScale({
  onPress,
  disabled,
  style,
  children,
  scaleTo = 0.94,
  hitSlop = 8,
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value) =>
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop}
      onPressIn={() => animateTo(scaleTo)}
      onPressOut={() => animateTo(1)}
      android_ripple={null}
      style={({ pressed }) => [{ opacity: disabled ? 0.6 : 1 }]}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
