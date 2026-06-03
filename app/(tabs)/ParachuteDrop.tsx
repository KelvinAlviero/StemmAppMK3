import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CameraView, useCameraPermissions } from 'expo-camera'; // <-- New import
import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

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

  // --- NEW PARACHUTE TEST STATE ---
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [distance, setDistance] = useState('1'); // Default 1 meter
  
  const [dropState, setDropState] = useState<'idle' | 'dropping' | 'finished'>('idle');
  const [timeTaken, setTimeTaken] = useState<number | null>(null);
  const [speed, setSpeed] = useState<number | null>(null);
  
  const startTimeRef = useRef<number>(0);

  const startCamera = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) return;
    }
    setIsCameraActive(true);
    resetTest();
  };

  const handleDropAction = () => {
    if (dropState === 'idle') {
      // Crossed Point A
      startTimeRef.current = performance.now();
      setDropState('dropping');
    } else if (dropState === 'dropping') {
      // Crossed Point B
      const endTime = performance.now();
      const elapsedSeconds = (endTime - startTimeRef.current) / 1000;
      
      const distNumber = parseFloat(distance) || 1;
      const calculatedSpeed = distNumber / elapsedSeconds;

      setTimeTaken(parseFloat(elapsedSeconds.toFixed(2)));
      setSpeed(parseFloat(calculatedSpeed.toFixed(2)));
      setDropState('finished');
    }
  };

  const resetTest = () => {
    setDropState('idle');
    setTimeTaken(null);
    setSpeed(null);
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
        <ThemedText type="title">Parachute Dropper</ThemedText>
      </ThemedView>
            
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Description</ThemedText>
        <ThemedText>1. Grab some toys and a makeshift parachute.</ThemedText>    
        <ThemedText>2. Point your camera to capture the full fall.</ThemedText> 
        <ThemedText>3. Tap when the toy crosses the top line, and tap again at the bottom line!</ThemedText> 
        
        {/* --- CAMERA & PARACHUTE UI --- */}
        <View style={styles.testContainer}>
          {!isCameraActive ? (
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#4da6ff' }]} onPress={startCamera}>
              <Text style={styles.actionButtonText}>Open Camera to Start</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.cameraWrapper}>
              <CameraView style={styles.camera} facing="back">
                {/* Visual Lines overlay */}
                <View style={styles.pointA}><Text style={styles.lineText}>POINT A (START)</Text></View>
                <View style={styles.pointB}><Text style={styles.lineText}>POINT B (END)</Text></View>
              </CameraView>

              {/* Controls Overlay */}
              <View style={[styles.controlsPanel, { backgroundColor: theme.background }]}>
                <View style={styles.inputRow}>
                  <Text style={{ color: theme.text, fontSize: 16 }}>Distance (meters):</Text>
                  <TextInput
                    style={[styles.distInput, { color: theme.inputText, borderColor: theme.inputBorder }]}
                    keyboardType="numeric"
                    value={distance}
                    onChangeText={setDistance}
                  />
                </View>

                {dropState === 'finished' ? (
                  <View style={styles.resultsBox}>
                    <Text style={[styles.resultText, { color: theme.text }]}>Time: {timeTaken} s</Text>
                    <Text style={[styles.resultText, { color: theme.text, fontWeight: 'bold' }]}>Speed: {speed} m/s</Text>
                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#ff4d4d', marginTop: 10 }]} onPress={resetTest}>
                      <Text style={styles.actionButtonText}>Reset Test</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={[styles.triggerButton, { backgroundColor: dropState === 'idle' ? '#00cc66' : '#ff4d4d' }]} 
                    onPress={handleDropAction}
                  >
                    <Text style={styles.triggerButtonText}>
                      {dropState === 'idle' ? 'TAP WHEN CROSSING A' : 'TAP WHEN CROSSING B'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
          
          {/* Fallback permission text */}
          {!permission?.granted && permission?.canAskAgain === false && (
            <Text style={{ color: '#ff4d4d', marginTop: 10 }}>Camera permission denied. Cannot run test.</Text>
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
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
  },
  actionButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraWrapper: {
    width: '100%',
    height: 500,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  pointA: {
    width: '100%',
    borderBottomWidth: 2,
    borderColor: '#00cc66',
    marginTop: '20%',
    paddingBottom: 5,
  },
  pointB: {
    width: '100%',
    borderTopWidth: 2,
    borderColor: '#ff4d4d',
    marginBottom: '20%',
    paddingTop: 5,
  },
  lineText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  controlsPanel: {
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  distInput: {
    borderWidth: 1,
    borderRadius: 5,
    width: 60,
    padding: 5,
    marginLeft: 10,
    textAlign: 'center',
  },
  triggerButton: {
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  triggerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  resultsBox: {
    alignItems: 'center',
    padding: 10,
  },
  resultText: {
    fontSize: 18,
    marginVertical: 2,
  }
});