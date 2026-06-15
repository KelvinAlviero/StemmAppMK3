import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

import * as Battery from 'expo-battery';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { auth } from '@/services/firebase';


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isLowBattery, setIsLowBattery] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const getBatteryLevel = async () => {
      try {
        const level = await Battery.getBatteryLevelAsync();
        setBatteryLevel(Math.round(level * 100));
        setIsLowBattery(level < 0.2);
      } catch (error) {
        console.log('Battery info not available');
      }
    };

    getBatteryLevel();
    const interval = setInterval(getBatteryLevel, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return null;
  }

  const tintColor = Colors[colorScheme ?? 'light'].tint;
  const batteryColor = isLowBattery ? '#FF4444' : tintColor;

  const getBatteryIcon = (level: number | null): any => {
    if (level === null) return 'battery-unknown';
    if (level <= 10) return 'battery-10';
    if (level <= 20) return 'battery-20';
    if (level <= 30) return 'battery-30';
    if (level <= 40) return 'battery-40';
    if (level <= 50) return 'battery-50';
    if (level <= 60) return 'battery-60';
    if (level <= 70) return 'battery-70';
    if (level <= 80) return 'battery-80';
    if (level <= 90) return 'battery-90';
    return 'battery';
  };

  const HeaderRight = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginRight: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <MaterialCommunityIcons
          name={getBatteryIcon(batteryLevel)}
          size={18}
          color={batteryColor}
        />
        <Text style={{ color: batteryColor, fontSize: 12, fontWeight: '600' }}>
          {batteryLevel}%
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => router.push('/settings')}
        style={{ padding: 8 }}
      >
        <MaterialCommunityIcons
          name="cog"
          size={24}
          color={tintColor}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerRight: () => <HeaderRight />,
          headerTintColor: Colors[colorScheme ?? 'light'].tint,
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#121212' : '#FFFFFF',
          },
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="home" options={{ headerShown: false }} />
            <Stack.Screen
              name="settings"
              options={{
                title: 'Settings',
                headerShown: true,
                headerBackVisible: true,
              }}
            />
          </>
        ) : (
          <Stack.Screen name="auth" options={{ headerShown: false }} />
        )}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
