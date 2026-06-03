import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { Accelerometer } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function HomeScreen() {
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

  // --- NEW EARTHQUAKE TEST STATE ---
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [peakAcceleration, setPeakAcceleration] = useState<number | null>(null);
  const [estimatedMagnitude, setEstimatedMagnitude] = useState<number | null>(null);
  const [damageReport, setDamageReport] = useState('');

  // Refs for tracking max shake
  const subscription = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxAccel = useRef(0);

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
    setCountdown(10);
    setPeakAcceleration(null);
    setEstimatedMagnitude(null);
    setDamageReport('');
    
    maxAccel.current = 0;

    // Fast updates to catch sudden jolts
    Accelerometer.setUpdateInterval(50); 
    
    subscription.current = Accelerometer.addListener(({ x, y, z }) => {
      // Get total force vector
      const rawMagnitude = Math.sqrt(x * x + y * y + z * z);
      // Subtract gravity (1G) to get only the shake force
      const shakeForce = Math.abs(rawMagnitude - 1);
      
      // Keep track of the hardest single jolt
      if (shakeForce > maxAccel.current) {
        maxAccel.current = shakeForce;
      }
    });

    // 10-second countdown
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
    
    // Process Results
    const peakG = maxAccel.current;
    
    // Formula to estimate a fun "Magnitude" (Caps around 9.9)
    // 0G = 1.0 Mag | 1G = 5.0 Mag | 2G+ = 8.0+ Mag
    let calculatedMag = (peakG * 4) + 1; 
    if (calculatedMag > 9.9) calculatedMag = 9.9;
    
    setPeakAcceleration(parseFloat(peakG.toFixed(2)));
    setEstimatedMagnitude(parseFloat(calculatedMag.toFixed(1)));

    // Generate Damage Report
    if (calculatedMag < 2.5) {
      setDamageReport("Microearthquake. Barely felt it. Buildings are fine.");
    } else if (calculatedMag >= 2.5 && calculatedMag < 4.5) {
      setDamageReport("Minor shake. Rattled some dishes, but structures are safe.");
    } else if (calculatedMag >= 4.5 && calculatedMag < 6.5) {
      setDamageReport("Moderate to Strong. Poorly built models might collapse!");
    } else if (calculatedMag >= 6.5 && calculatedMag < 8.0) {
      setDamageReport("Major Earthquake! Serious damage to standard structures.");
    } else {
      setDamageReport("Cataclysmic! Total destruction. Your building didn't stand a chance. 💥");
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
        
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Earthquake Resistance</ThemedText>
      </ThemedView>
            
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Description</ThemedText>
        <ThemedText>1. Place phone onto a surface or model building.</ThemedText>    
        <ThemedText>2. Press start, wait for the timer, and shake the surface!</ThemedText> 
        <ThemedText>3. Get your magnitude and damage report.</ThemedText> 
        
        {/* --- EARTHQUAKE TEST UI --- */}
        <View style={styles.testContainer}>
          <TouchableOpacity
            style={[
              styles.recordButton,
              { backgroundColor: isRecording ? '#ff9900' : theme.text }
            ]}
            onPress={isRecording ? undefined : startTest}
            disabled={isRecording}
          >
            <Text style={{ color: theme.background, fontSize: 18, fontWeight: 'bold' }}>
              {isRecording ? `Simulating... ${countdown}s` : 'Start 10s Timer'}
            </Text>
          </TouchableOpacity>

          {/* Results Tab */}
          {estimatedMagnitude !== null && !isRecording && (
            <ThemedView style={[styles.resultCard, { borderColor: theme.inputBorder }]}>
              <ThemedText type="subtitle">Seismic Activity Report</ThemedText>
              <ThemedText style={{ fontSize: 36, fontWeight: 'bold', color: '#ff9900', marginTop: 10 }}>
                Mag {estimatedMagnitude}
              </ThemedText>
              <ThemedText style={{ fontSize: 16, marginTop: 5 }}>
                Peak Force: {peakAcceleration} G
              </ThemedText>
              <ThemedText style={{ fontSize: 16, textAlign: 'center', marginTop: 15, fontWeight: '600' }}>
                {damageReport}
              </ThemedText>
            </ThemedView>
          )}
        </View>
        {/* -------------------------------- */}
          
        <ThemedText type="defaultSemiBold" style={{ marginTop: 20 }}>
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
    marginTop: 20,
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