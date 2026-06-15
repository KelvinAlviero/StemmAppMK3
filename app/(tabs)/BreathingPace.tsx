import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { Accelerometer } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function BreatingPacer() {
  const [teamName, setTeamName] = useState('');
  const [memberInput, setMemberInput] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [memberError, setMemberError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Theme switcher
  const systemTheme = useColorScheme(); 
  const [isDarkMode, setIsDarkMode] = useState(systemTheme === 'dark');
  const theme = {
    background: isDarkMode ? '#121212' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    inputBackground: isDarkMode ? '#1a1a1a' : '#f5f5f5',
    inputBorder: isDarkMode ? '#555' : '#ddd',
    inputText: isDarkMode ? '#fff' : '#000',
    placeholderText: isDarkMode ? '#888' : '#999',
  };

  // --- NEW BREATHING TEST STATE ---
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [breathsPerMinute, setBreathsPerMinute] = useState<number | null>(null);
  const [comparisonText, setComparisonText] = useState('');

  // Refs for real-time math
  const subscription = useRef<any>(null);
   const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breathCount = useRef(0);
  const smoothedMag = useRef(0.0); // Baseline movement (gravity already subtracted)
  const isChestRising = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (subscription.current) subscription.current.remove();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTest = async () => {
    const isAvailable = await Accelerometer.isAvailableAsync();
    if (!isAvailable) {
      console.log("Accelerometer not available.");
      return; 
    }

    setIsRecording(true);
    setCountdown(30);
    setBreathsPerMinute(null);
    setComparisonText('');
    
    breathCount.current = 0;
    smoothedMag.current = 0.0;
    isChestRising.current = false;

    // Fast updates for smooth wave detection
    Accelerometer.setUpdateInterval(50); 
    
    subscription.current = Accelerometer.addListener(({ x, y, z }) => {
      const rawMagnitude = Math.sqrt(x * x + y * y + z * z);
      // Subtract gravity (1G) to isolate breathing movement
      const breathingMovement = Math.abs(rawMagnitude - 1);
      
      // Low-Pass Filter: Smooths out sharp jitters to find the slow breathing wave
      smoothedMag.current = smoothedMag.current + 0.05 * (breathingMovement - smoothedMag.current);

      // Peak detection (Thresholds might need tweaking based on testing!)
      const upperThreshold = 0.05; // Chest rising
      const lowerThreshold = 0.01; // Chest falling

      if (smoothedMag.current > upperThreshold && !isChestRising.current) {
        isChestRising.current = true;
      } else if (smoothedMag.current < lowerThreshold && isChestRising.current) {
        // A full cycle (rise then fall) is completed
        isChestRising.current = false;
        breathCount.current += 1;
      }
    });

    // 30-second countdown
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          stopTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTest = () => {
    if (subscription.current) {
      subscription.current.remove();
      subscription.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    
    // We measured for 30 seconds, so multiply by 2 for Breaths Per Minute
    const finalBpm = breathCount.current * 2;
    setBreathsPerMinute(finalBpm);

    // Generate comparison text
    if (finalBpm < 12) {
      setComparisonText("Lower than average");
    } else if (finalBpm >= 12 && finalBpm <= 20) {
      setComparisonText("Average resting pace");
    } else if (finalBpm > 20 && finalBpm <= 35) {
      setComparisonText("Elevated pace");
    } else {
      setComparisonText("Very high pace");
    }
  };
  // ---------------------------------

  const getPlatformName = () => {
    if (Platform.OS === 'ios') return 'iOS';
    if (Platform.OS === 'android') return 'Android';
    if (Platform.OS === 'windows') return 'Windows PC';
    if (Platform.OS === 'macos') return 'macOS';
    if (Platform.OS === 'web') return 'Web Browser';
    return 'Unknown Device';
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>   
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <TouchableOpacity 
          style={[styles.header, styles.themeButton]} 
          onPress={() => setIsDarkMode(!isDarkMode)}
          activeOpacity={0.7}
        >
          <Text style={{ color: theme.text, marginRight: 10, fontWeight: '600' }}>
            {isDarkMode ? '🌙 Dark' : '☀️ Light'}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.mainText, { color: theme.text }]}>
          {isDarkMode ? "Dark mode on" : "Light mode on"}
        </Text>
      </View>

      <ThemedView style={styles.titleContainer}></ThemedView> 
      <ThemedView style={styles.titleContainer}></ThemedView> 
      <ThemedView style={styles.titleContainer}></ThemedView> 
        
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Breathing Pace Chart</ThemedText>
      </ThemedView>
            
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Description</ThemedText>
        <ThemedText>1. Do a light exercise to get yourself pumping</ThemedText>    
        <ThemedText>2. Rest and put your phone completely flat on your chest</ThemedText> 
        <ThemedText>3. Press record and breathe naturally for 30 seconds</ThemedText>    
        <ThemedText>4. Get your results!</ThemedText> 
        
        {/* --- BREATHING TEST UI --- */}
        <View style={styles.testContainer}>
          <TouchableOpacity
            style={[
              styles.recordButton,
              { backgroundColor: isRecording ? '#4da6ff' : theme.text }
            ]}
            onPress={isRecording ? undefined : startTest}
            disabled={isRecording}
          >
            <Text style={{ color: theme.background, fontSize: 18, fontWeight: 'bold' }}>
              {isRecording ? `Recording... ${countdown}s` : 'Start 30s Timer'}
            </Text>
          </TouchableOpacity>

          {/* Results Tab */}
          {breathsPerMinute !== null && !isRecording && (
            <ThemedView style={[styles.resultCard, { borderColor: theme.inputBorder }]}>
              <ThemedText type="subtitle">Workout Results</ThemedText>
              <ThemedText style={{ fontSize: 32, fontWeight: 'bold', color: '#4da6ff', marginTop: 10 }}>
                {breathsPerMinute} BPM
              </ThemedText>
              <ThemedText style={{ fontSize: 16, textAlign: 'center', marginTop: 10 }}>
                {comparisonText}
              </ThemedText>
              <ThemedText style={{ fontSize: 12, color: theme.placeholderText, marginTop: 15, textAlign: 'center' }}>
                (Normal resting is 12-20 breaths per minute)
              </ThemedText>
            </ThemedView>
          )}
        </View>
        {/* -------------------------------- */}
          
        <ThemedText type="defaultSemiBold">
          {`(Running on ${getPlatformName()})`}
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginTop: 8,
  },
  inputError: {
    borderColor: '#ff4d4d',
  },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { position: 'absolute', top: 50, right: 20, flexDirection: 'row', alignItems: 'center' },
  themeButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: 'rgba(128, 128, 128, 0.2)' },
  mainText: { fontSize: 20, fontWeight: 'bold' },
  
  // Test Component Styles
  testContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  recordButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultCard: {
    marginTop: 15,
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
});