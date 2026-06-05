import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function ReactionTest() {
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

  // --- NEW REACTION TEST STATE ---
  const [testState, setTestState] = useState<'idle' | 'waiting' | 'ready' | 'result' | 'early'>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [comparisonMessage, setComparisonMessage] = useState('');

  const timeoutRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // Cleanup on unmount to prevent memory leaks if they leave the page mid-test
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handlePress = () => {
    if (testState === 'idle' || testState === 'result' || testState === 'early') {
      // Start the test
      setTestState('waiting');
      setReactionTime(null);
      setComparisonMessage('');

      // Random delay between 3 and 6 seconds (3000ms - 6000ms)
      const delay = 3000 + Math.random() * 3000;

      timeoutRef.current = setTimeout(() => {
        setTestState('ready');
        // Record the exact millisecond the button turns green
        startTimeRef.current = performance.now(); 
      }, delay);

    } else if (testState === 'waiting') {
      // User tapped too early!
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setTestState('early');

    } else if (testState === 'ready') {
      // Valid tap!
      const endTime = performance.now();
      const timeTaken = Math.round(endTime - startTimeRef.current);
      
      setReactionTime(timeTaken);
      setTestState('result');

      // Generate comparisons based on average human limits
      if (timeTaken < 150) {
        setComparisonMessage("Superhuman! Are you an esports pro? ⚡");
      } else if (timeTaken >= 150 && timeTaken <= 250) {
        setComparisonMessage("Excellent! Faster than the average human. 🚀");
      } else if (timeTaken > 250 && timeTaken <= 350) {
        setComparisonMessage("Average human reaction time. Solid! 👍");
      } else {
        setComparisonMessage("A bit slow. Maybe you need some coffee? ☕");
      }
    }
  };

  // Helper to dynamically change button color and text based on state
  const getButtonUI = () => {
    switch (testState) {
      case 'idle':
        return { color: '#4da6ff', text: 'Tap to Start' };
      case 'waiting':
        return { color: '#ff4d4d', text: 'Wait for Green...' };
      case 'ready':
        return { color: '#00cc66', text: 'TAP NOW!' };
      case 'early':
        return { color: theme.inputBorder, text: 'Too early! Tap to try again.' };
      case 'result':
        return { color: '#4da6ff', text: 'Tap to restart' };
      default:
        return { color: '#4da6ff', text: 'Start' };
    }
  };

  const buttonUI = getButtonUI();
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
        <ThemedText type="title">Reaction Test</ThemedText>
      </ThemedView>
            
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Description</ThemedText>
        <ThemedText>1. Tap the big button to start.</ThemedText>    
        <ThemedText>2. Wait for the button to turn green (no early tapping!).</ThemedText> 
        <ThemedText>3. When it lights up, tap it as fast as you can to get your millisecond score.</ThemedText> 
        
        {/* --- REACTION TEST UI --- */}
        <View style={styles.testContainer}>
          <TouchableOpacity
            style={[styles.reactionArea, { backgroundColor: buttonUI.color }]}
            onPress={handlePress}
            activeOpacity={0.8}
          >
            <Text style={styles.reactionAreaText}>{buttonUI.text}</Text>
          </TouchableOpacity>

          {/* Results Tab */}
          {testState === 'result' && reactionTime !== null && (
            <ThemedView style={[styles.resultCard, { borderColor: theme.inputBorder }]}>
              <ThemedText type="subtitle">Your Reaction Time</ThemedText>
              
              <Text style={{ fontSize: 48, fontWeight: '900', color: theme.text, marginTop: 10 }}>
                {reactionTime} ms
              </Text>
              
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#4da6ff', marginTop: 15, textAlign: 'center' }}>
                {comparisonMessage}
              </Text>

              <Text style={{ fontSize: 14, color: theme.placeholderText, marginTop: 10, textAlign: 'center' }}>
                (Average human reaction time is ~250 ms)
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
  reactionArea: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  reactionAreaText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  resultCard: {
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
});