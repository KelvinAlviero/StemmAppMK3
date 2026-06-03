import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

{/*Functions for groups*/}
export default function HomeScreen() {
  const [teamName, setTeamName] = useState('');
  const [memberInput, setMemberInput] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [memberError, setMemberError] = useState('');
  const [loading, setLoading] = useState(false);
  
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

      {/*Group making box, NOT DONE DON'T TRY PLEASE!!*/}
      <ThemedView style={styles.titleContainer}>
        </ThemedView> 
        <ThemedView style={styles.titleContainer}>
        </ThemedView> 
        <ThemedView style={styles.titleContainer}>
        </ThemedView> 
        
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Group Name Creation</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Create your group name</ThemedText>
        <ThemedText>
          Remember,name that are <ThemedText type="defaultSemiBold">Similar or Contain rude words</ThemedText> will be rejected.
        </ThemedText>    
        
        <ThemedView style={styles.titleContainer}>
        </ThemedView> 
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.inputText }, error ? styles.inputError : null]}
          placeholder="ex. MIBOMBO-"
          placeholderTextColor={theme.placeholderText}
          value={teamName}
          onChangeText={handleTeamNameChange}
          maxLength={30}
          autoCapitalize="words"
          returnKeyType="done"
          editable={!loading}
        />
          
          {/*Platform checker*/}
          <ThemedText type="defaultSemiBold">
            {`(Running on ${getPlatformName()})`}
        </ThemedText>
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
  mainText: { fontSize: 20, fontWeight: 'bold' }
  },
);
