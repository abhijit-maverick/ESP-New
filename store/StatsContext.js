import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'esp-stats-v1';

const emptyGame = () => ({ attempts: 0, correct: 0, currentStreak: 0, bestStreak: 0 });

const DEFAULT = {
  overall: { attempts: 0, correct: 0, currentStreak: 0, bestStreak: 0 },
  games: {
    coin: emptyGame(),
    box3: emptyGame(),
    box5: emptyGame(),
    zener: emptyGame(),
  },
  recent: [], // most recent outcomes as booleans (true = hit)
};

const StatsContext = createContext(null);

function bump(node, won) {
  const currentStreak = won ? node.currentStreak + 1 : 0;
  return {
    attempts: node.attempts + 1,
    correct: node.correct + (won ? 1 : 0),
    currentStreak,
    bestStreak: Math.max(node.bestStreak, currentStreak),
  };
}

export function StatsProvider({ children }) {
  const [stats, setStats] = useState(DEFAULT);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (active && raw) {
          const saved = JSON.parse(raw);
          setStats({
            overall: { ...DEFAULT.overall, ...saved.overall },
            games: { ...DEFAULT.games, ...saved.games },
            recent: Array.isArray(saved.recent) ? saved.recent : [],
          });
        }
      } catch (e) {
        // Corrupt or missing storage — start fresh.
      }
      if (active) setLoaded(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stats)).catch(() => {});
    }
  }, [stats, loaded]);

  const recordResult = useCallback((gameKey, won) => {
    setStats((prev) => {
      const game = prev.games[gameKey] || emptyGame();
      return {
        overall: bump(prev.overall, won),
        games: { ...prev.games, [gameKey]: bump(game, won) },
        recent: [...prev.recent, !!won].slice(-40),
      };
    });
  }, []);

  const resetAll = useCallback(() => setStats(DEFAULT), []);

  return (
    <StatsContext.Provider value={{ stats, recordResult, resetAll }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const ctx = useContext(StatsContext);
  if (!ctx) throw new Error('useStats must be used within a StatsProvider');
  return ctx;
}
