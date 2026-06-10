import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerRight: () => (
          <TouchableOpacity
            onPress={() => router.push('/(tabs)')}
            style={{ marginRight: 16, padding: 8 }}
          >
            <MaterialCommunityIcons
              name="home"
              size={24}
              color={Colors[colorScheme ?? 'light'].tint}
            />
          </TouchableOpacity>
        ),
        headerTintColor: Colors[colorScheme ?? 'light'].tint,
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#121212' : '#FFFFFF',
        },
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Home',
          headerRight: undefined,
        }}
      />
      <Stack.Screen
        name="BreathingPace"
        options={{
          title: 'Breathing Pace',
        }}
      />
      <Stack.Screen
        name="E_Resistance"
        options={{
          title: 'E Resistance',
        }}
      />
      <Stack.Screen
        name="HandFan"
        options={{
          title: 'Hand Fan',
        }}
      />
      <Stack.Screen
        name="HumanPace"
        options={{
          title: 'Human Pace',
        }}
      />
      <Stack.Screen
        name="ParachuteDrop"
        options={{
          title: 'Parachute Drop',
        }}
      />
      <Stack.Screen
        name="ReactionTest"
        options={{
          title: 'Reaction Test',
        }}
      />
      <Stack.Screen
        name="SoundHunter"
        options={{
          title: 'Sound Hunter',
        }}
      />
    </Stack>
  );
}
