import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
<AntDesign name="shake" size={24} color="black" />
{/*Functions for groups*/}
export default function HomeScreen() {
  const router = useRouter();
  const [teamName, setTeamName] = useState('');
  const [memberInput, setMemberInput] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [memberError, setMemberError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Tab navigation data
  const tabs = [
    { name: 'Breathing Pace', route: 'BreathingPace', icon: 'lungs' },
    { name: 'Earthquake Resistance', route: 'E_Resistance', icon: 'vibrate' },
    { name: 'Hand Fan', route: 'HandFan', icon: 'feather' },
    { name: 'Human Pace', route: 'HumanPace', icon: 'run' },
    { name: 'Parachute Drop', route: 'ParachuteDrop', icon: 'parachute' },
    { name: 'Reaction Test', route: 'ReactionTest', icon: 'flash' },
    { name: 'Sound Hunter', route: 'SoundHunter', icon: 'volume-high' },
  ];
  
  //Theme switcher
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

  {/*Platform Checker*/}
  const getPlatformName = () => {
  if (Platform.OS === 'ios') return 'iOS';
  if (Platform.OS === 'android') return 'Android';
  if (Platform.OS === 'windows') return 'Windows PC';
  if (Platform.OS === 'macos') return 'macOS';
  if (Platform.OS === 'web') return 'Web Browser';
  return 'Unknown Device';
};
function handleTeamNameChange(text: string) {
    setTeamName(text);
    setError('');
}
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
 }>   
{/*Theme switcher*/}
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


      {/*Tabs Grid*/}
      <ThemedView style={styles.titleContainer}>
              </ThemedView> 
              <ThemedView style={styles.titleContainer}>
              </ThemedView> 
              <ThemedView style={styles.titleContainer}>
              </ThemedView> 
      {/*Used to space stuff*/}
      <ThemedView style={styles.gridHeaderContainer}>
        <ThemedText type="title">Explore Activities</ThemedText>
      </ThemedView>

      <ThemedView style={styles.gridContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.gridButton, { backgroundColor: isDarkMode ? '#2a2a2a' : '#e8e8e8' }]}
            onPress={() => router.push(tab.route as any)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons 
                name={tab.icon as any} 
                size={40} 
                color={theme.text}
              />
            </View>
            <Text style={[styles.gridButtonText, { color: theme.text }]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}


{/*Style sheets*/}
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
  mainText: { fontSize: 15, fontWeight: 'bold' },
  gridHeaderContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 5, // Space between grid items
    paddingHorizontal: 0, //Grid padding for sides
    paddingVertical: 10, //Grid padding for top and bottom
    paddingBottom: 32,
  },
  gridButton: {
    width: '45%',
    aspectRatio: 0.65,
    borderRadius: 15,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  tabIcon: {
    marginBottom: 50,
  },
  gridButtonText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    paddingBottom: 4,
  },
});
