import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';

export default function GPSScreen() {
  const colorScheme = useColorScheme();
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setError('GPS is not available on web');
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const Location = await import('expo-location');
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          setLoading(false);
          return;
        }

        try {
          // Try to get current position with specific accuracy and timeout
          let currentLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000,
            mayShowUserSettingsDialog: true,
          });
          setLocation(currentLocation);
          setLoading(false);
        } catch (getCurrentErr) {
          // Fallback to last known position if getCurrentPosition fails
          let lastLocation = await Location.getLastKnownPositionAsync({});
          if (lastLocation) {
            setLocation(lastLocation);
            setLoading(false);
          } else {
            setError('Unable to retrieve location. Please ensure location services are enabled.');
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Location error:', err);
        setError('Failed to access location services');
        setLoading(false);
      }
    })();
  }, []);

  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.centerContent}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.tint} />
        ) : error ? (
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={64}
              color={colors.tint}
              style={{ marginBottom: 16 }}
            />
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </View>
        ) : location ? (
          <View style={styles.gpsContainer}>
            <MaterialCommunityIcons
              name="crosshairs-gps"
              size={64}
              color={colors.tint}
              style={{ marginBottom: 20 }}
            />
            <ThemedText style={styles.label}>Latitude</ThemedText>
            <ThemedText style={styles.value}>
              {location.coords.latitude.toFixed(6)}
            </ThemedText>

            <ThemedText style={[styles.label, { marginTop: 16 }]}>Longitude</ThemedText>
            <ThemedText style={styles.value}>
              {location.coords.longitude.toFixed(6)}
            </ThemedText>

            <ThemedText style={[styles.label, { marginTop: 16 }]}>Accuracy</ThemedText>
            <ThemedText style={styles.value}>
              {location.coords.accuracy?.toFixed(2)} m
            </ThemedText>

            <ThemedText style={[styles.label, { marginTop: 16 }]}>Altitude</ThemedText>
            <ThemedText style={styles.value}>
              {location.coords.altitude?.toFixed(2)} m
            </ThemedText>
          </View>
        ) : null}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  gpsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    opacity: 0.7,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
