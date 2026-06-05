import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Audio } from 'expo-av'; // <-- New import
import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function SoundHunters() {
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

  // --- NEW SOUND TRACKER STATE ---
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [maxDecibels, setMaxDecibels] = useState<number | null>(null);
  const [comparisonText, setComparisonText] = useState('');
  const [warningText, setWarningText] = useState('');

  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const peakDbRef = useRef<number>(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startTest = async () => {
    try {
      // Request permissions
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        console.log('Microphone permission denied');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      setIsRecording(true);
      setCountdown(5);
      setMaxDecibels(null);
      setComparisonText('');
      setWarningText('');
      peakDbRef.current = 0;

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        // Callback to check sound levels every 100ms
        (status) => {
          // RecordingStatus may not have isMeteringEnabled; just check metering value
          if (typeof status.metering === 'number') {
            // Convert negative dBFS to a positive SPL estimate (offset by ~160)
            const currentSPL = Math.max(0, status.metering + 160);
            if (currentSPL > peakDbRef.current) {
              peakDbRef.current = currentSPL;
            }
          }
        },
        100 // Update interval in ms
      );

      recordingRef.current = recording;

      // 5-second countdown timer
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            stopTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      console.error('Failed to start recording', err);
      setIsRecording(false);
    }
  };

  const stopTest = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (recordingRef.current) {
      await recordingRef.current.stopAndUnloadAsync();
      recordingRef.current = null;
    }
    
    setIsRecording(false);
    
    // Process Results
    const finalDb = Math.round(peakDbRef.current);
    setMaxDecibels(finalDb);

    // Generate comparisons based on standard SPL charts
    if (finalDb < 40) {
      setComparisonText("Whisper / Quiet Library 🤫");
      setWarningText("Completely safe.");
    } else if (finalDb >= 40 && finalDb < 65) {
      setComparisonText("Normal Conversation 🗣️");
      setWarningText("Safe for long periods.");
    } else if (finalDb >= 65 && finalDb < 85) {
      setComparisonText("City Traffic / Vacuum Cleaner 🚗");
      setWarningText("Annoying, but mostly safe.");
    } else if (finalDb >= 85 && finalDb < 105) {
      setComparisonText("Lawnmower / Power Tools 🚜");
      setWarningText("Warning: Can cause damage after 2 hours!");
    } else if (finalDb >= 105 && finalDb < 120) {
      setComparisonText("Rock Concert / Chainsaw 🎸");
      setWarningText("DANGER: Hearing damage possible in less than 5 minutes.");
    } else {
      setComparisonText("Jet Engine / Firecracker ✈️");
      setWarningText("CRITICAL: Immediate risk of permanent hearing loss!");
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
        <ThemedText type="title">Sound Hunters</ThemedText>
      </ThemedView>
            
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Description</ThemedText>
        <ThemedText>1. Hold the phone near an audio source.</ThemedText>    
        <ThemedText>2. Click start to listen for 5 seconds.</ThemedText> 
        <ThemedText>3. Get your decibel count and damage assessment!</ThemedText> 
        
        {/* --- SOUND TEST UI --- */}
        <View style={styles.testContainer}>
          <TouchableOpacity
            style={[
              styles.recordButton,
              { backgroundColor: isRecording ? '#ff4d4d' : '#8a2be2' }
            ]}
            onPress={isRecording ? undefined : startTest}
            disabled={isRecording}
          >
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
              {isRecording ? `Listening... ${countdown}s` : 'Start 5s Recording'}
            </Text>
          </TouchableOpacity>

          {/* Results Tab */}
          {maxDecibels !== null && !isRecording && (
            <ThemedView style={[styles.resultCard, { borderColor: theme.inputBorder }]}>
              <ThemedText type="subtitle">Loudest Peak Recorded</ThemedText>
              
              <Text style={{ fontSize: 48, fontWeight: '900', color: maxDecibels > 85 ? '#ff4d4d' : '#00cc66', marginTop: 10 }}>
                {maxDecibels} dB
              </Text>
              
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginTop: 15, textAlign: 'center' }}>
                Equivalent to:
              </Text>
              <Text style={{ fontSize: 18, color: '#4da6ff', textAlign: 'center', marginBottom: 10 }}>
                {comparisonText}
              </Text>

              <Text style={{ fontSize: 14, fontWeight: 'bold', color: maxDecibels > 85 ? '#ff4d4d' : theme.placeholderText, textAlign: 'center' }}>
                {warningText}
              </Text>
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