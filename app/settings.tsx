import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { auth } from '@/services/firebase';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace('/');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
              console.error('Sign out error:', error);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.settingsList}>
        <TouchableOpacity
          style={[
            styles.settingItem,
            { borderBottomColor: Colors[colorScheme ?? 'light'].border },
          ]}
          onPress={handleSignOut}
        >
          <MaterialCommunityIcons
            name="logout"
            size={24}
            color={Colors[colorScheme ?? 'light'].tint}
            style={styles.settingIcon}
          />
          <ThemedText style={styles.settingText}>Sign Out</ThemedText>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={Colors[colorScheme ?? 'light'].text}
            style={styles.chevron}
          />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingsList: {
    marginTop: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
  },
  chevron: {
    marginLeft: 8,
  },
});
