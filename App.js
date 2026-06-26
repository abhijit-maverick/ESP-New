import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import CoinFlipScreen from './screens/CoinFlipScreen';
import BoxGameScreen from './screens/BoxGameScreen';
import ZenerCardsScreen from './screens/ZenerCardsScreen';
import TrackerScreen from './screens/TrackerScreen';
import LearnScreen from './screens/LearnScreen';
import { StatsProvider } from './store/StatsContext';
import { colors } from './theme';

const Stack = createNativeStackNavigator();

const navTheme = {
  dark: false,
  colors: {
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.accent,
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    bold: { fontFamily: 'System', fontWeight: '700' },
    heavy: { fontFamily: 'System', fontWeight: '800' },
  },
};

export default function App() {
  return (
    <StatsProvider>
      <SafeAreaProvider>
        <NavigationContainer theme={navTheme}>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: colors.surface },
              headerTitleStyle: { color: colors.text, fontWeight: '700' },
              headerTintColor: colors.primary,
              headerShadowVisible: false,
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CoinFlip" component={CoinFlipScreen} options={{ title: 'Coin Call' }} />
            <Stack.Screen name="BoxGame" component={BoxGameScreen} options={{ title: 'Hidden Ball' }} />
            <Stack.Screen name="Zener" component={ZenerCardsScreen} options={{ title: 'Zener Symbols' }} />
            <Stack.Screen name="Tracker" component={TrackerScreen} options={{ title: 'ESP Tracker' }} />
            <Stack.Screen name="Learn" component={LearnScreen} options={{ title: 'Train Your ESP' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </StatsProvider>
  );
}
