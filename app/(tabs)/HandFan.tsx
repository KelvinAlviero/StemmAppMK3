import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import { useState } from 'react';
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

  // --- NEW FAN TEST STATE ---
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [angle, setAngle] = useState(0); // 0 = straight up, 90 = flat
  const [windSpeed, setWindSpeed] = useState<number | null>(null);
  const [comparisonText, setComparisonText] = useState('');

  const startCamera = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) return;
    }
    setIsCameraActive(true);
    resetTest();
  };

  const adjustAngle = (increment: number) => {
    setAngle((prev) => {
      const newAngle = prev + increment;
      if (newAngle < 0) return 0;
      if (newAngle > 90) return 90;
      return newAngle;
    });
  };

  const calculateWindSpeed = () => {
    // This is a simplified estimation formula.
    // In reality, it depends heavily on paper weight and size.
    // Assuming standard A4 printer paper:
    // Angle 0 = 0 m/s
    // Angle 45 = ~3 m/s
    // Angle 80+ = ~8+ m/s

    let estimatedSpeed = 0;
    if (angle > 0) {
        // A non-linear curve to simulate drag force
        estimatedSpeed = Math.pow(angle / 15, 1.5); 
    }

    setWindSpeed(parseFloat(estimatedSpeed.toFixed(1)));

    // Generate comparison text
    if (estimatedSpeed < 1) {
      setComparisonText("Calm air. Barely a breeze.");
    } else if (estimatedSpeed >= 1 && estimatedSpeed < 3.5) {
      setComparisonText("Light breeze. Leaves would rustle.");
    } else if (estimatedSpeed >= 3.5 && estimatedSpeed < 8) {
      setComparisonText("Moderate breeze. Small branches move.");
    } else {
      setComparisonText("Strong wind! Hold onto your hats! 💨");
    }
  };

  const resetTest = () => {
    setAngle(0);
    setWindSpeed(null);
    setComparisonText('');
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
        <ThemedText type="title">Hand Fan Test</ThemedText>
      </ThemedView>
            
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Description</ThemedText>
        <ThemedText>1. Stand a piece of paper upright on a table.</ThemedText>    
        <ThemedText>2. Turn on a fan or blow on the paper so it bends backward.</ThemedText> 
        <ThemedText>3. Open the camera, align the red line with the bend of the paper, and calculate!</ThemedText> 
        
        {/* --- CAMERA & FAN UI --- */}
        <View style={styles.testContainer}>
          {!isCameraActive ? (
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#4da6ff' }]} onPress={startCamera}>
              <Text style={styles.actionButtonText}>Open Camera to Start</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.cameraWrapper}>
              <CameraView style={styles.camera} facing="back">
                {/* Visual Protractor Overlay */}
                <View style={styles.overlayContainer}>
                  {/* Vertical Reference Line (0 degrees) */}
                  <View style={styles.verticalLine} />
                  
                  {/* Adjustable Measurement Line */}
                  <View 
                    style={[
                      styles.measurementLine, 
                      { transform: [{ rotate: `${angle}deg` }] }
                    ]} 
                  />
                  <Text style={styles.angleText}>{angle}° Bend</Text>
                </View>
              </CameraView>

              {/* Controls Overlay */}
              <View style={[styles.controlsPanel, { backgroundColor: theme.background }]}>
                {windSpeed === null ? (
                  <>
                    <Text style={[styles.instructionText, { color: theme.text }]}>
                      Adjust the red line to match the bend of the paper.
                    </Text>
                    <View style={styles.angleControls}>
                      <TouchableOpacity style={styles.adjustBtn} onPress={() => adjustAngle(-5)}>
                        <Text style={styles.adjustBtnText}>- 5°</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.adjustBtn} onPress={() => adjustAngle(5)}>
                        <Text style={styles.adjustBtnText}>+ 5°</Text>
                      </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity 
                      style={[styles.calculateButton, { backgroundColor: '#00cc66' }]} 
                      onPress={calculateWindSpeed}
                    >
                      <Text style={styles.actionButtonText}>Calculate Wind Speed</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <View style={styles.resultsBox}>
                    <Text style={[styles.resultText, { color: theme.text }]}>Bend Angle: {angle}°</Text>
                    <Text style={[styles.resultText, { color: '#4da6ff', fontWeight: 'bold', fontSize: 24 }]}>
                      Speed: {windSpeed} m/s
                    </Text>
                    <Text style={[styles.resultText, { color: theme.text, textAlign: 'center', marginTop: 5 }]}>
                      {comparisonText}
                    </Text>
                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#ff4d4d', marginTop: 15 }]} onPress={resetTest}>
                      <Text style={styles.actionButtonText}>Measure Again</Text>
                    </TouchableOpacity>
                  </View>
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
    height: 550,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContainer: {
    width: 200,
    height: 200,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  verticalLine: {
    position: 'absolute',
    bottom: 0,
    width: 2,
    height: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderStyle: 'dashed',
  },
  measurementLine: {
    position: 'absolute',
    bottom: 0,
    width: 4,
    height: 150,
    backgroundColor: '#ff4d4d',
    transformOrigin: 'bottom center', // Ensure it rotates from the bottom anchor
  },
  angleText: {
    position: 'absolute',
    top: -30,
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  controlsPanel: {
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  instructionText: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 10,
  },
  angleControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  adjustBtn: {
    backgroundColor: 'rgba(128, 128, 128, 0.3)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  adjustBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  calculateButton: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
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