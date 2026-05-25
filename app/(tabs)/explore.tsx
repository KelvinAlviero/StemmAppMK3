import { Image } from 'expo-image';
import { useState } from 'react';
import { Platform, StyleSheet, TextInput } from 'react-native';

import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabTwoScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();

  const sections = [
    { title: 'File-based routing', content: 'routing' },
    { title: 'Android, iOS, and web support', content: 'platform' },
    { title: 'Images', content: 'images' },
    { title: 'Light and dark mode components', content: 'theme' },
    { title: 'Animations', content: 'animations' },
  ];

  const filteredSections = searchQuery.trim() === '' 
    ? sections 
    : sections.filter(section => 
        section.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Explore
        </ThemedText>
      </ThemedView>

      <TextInput
        style={[
          styles.searchBar,
          { 
            color: colorScheme === 'dark' ? '#fff' : '#000',
            backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f0f0f0',
            borderColor: colorScheme === 'dark' ? '#444' : '#ddd',
          }
        ]}
        placeholder="Search topics..."
        placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ThemedText>
        {filteredSections.length === 0 && searchQuery ? 
          'No topics found matching your search.' : 
          'This app includes example code to help you get started.'
        }
      </ThemedText>

      {filteredSections.map((section) => (
        section.content === 'routing' && (
          <Collapsible key="routing" title="File-based routing">
            <ThemedText>
              This app has two screens:{' '}
              <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
              <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
            </ThemedText>
            <ThemedText>
              The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
              sets up the tab navigator.
            </ThemedText>
            <ExternalLink href="https://docs.expo.dev/router/introduction">
              <ThemedText type="link">Learn more</ThemedText>
            </ExternalLink>
          </Collapsible>
        ) ||
        section.content === 'platform' && (
          <Collapsible key="platform" title="Android, iOS, and web support">
            <ThemedText>
              You can open this project on Android, iOS, and the web. To open the web version, press{' '}
              <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
            </ThemedText>
          </Collapsible>
        ) ||
        section.content === 'images' && (
          <Collapsible key="images" title="Images">
            <ThemedText>
              For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
              <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
              different screen densities
            </ThemedText>
            <Image
              source={require('@/assets/images/react-logo.png')}
              style={{ width: 100, height: 100, alignSelf: 'center' }}
            />
            <ExternalLink href="https://reactnative.dev/docs/images">
              <ThemedText type="link">Learn more</ThemedText>
            </ExternalLink>
          </Collapsible>
        ) ||
        section.content === 'theme' && (
          <Collapsible key="theme" title="Light and dark mode components">
            <ThemedText>
              This template has light and dark mode support. The{' '}
              <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
              what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
            </ThemedText>
            <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
              <ThemedText type="link">Learn more</ThemedText>
            </ExternalLink>
          </Collapsible>
        ) ||
        section.content === 'animations' && (
          <Collapsible key="animations" title="Animations">
            <ThemedText>
              This template includes an example of an animated component. The{' '}
              <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
              the powerful{' '}
              <ThemedText type="defaultSemiBold" style={{ fontFamily: Fonts.mono }}>
                react-native-reanimated
              </ThemedText>{' '}
              library to create a waving hand animation.
            </ThemedText>
            {Platform.select({
              ios: (
                <ThemedText>
                  The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
                  component provides a parallax effect for the header image.
                </ThemedText>
              ),
            })}
          </Collapsible>
        )
      ))}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  searchBar: {
    marginVertical: 12,
    marginHorizontal: 0,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
});
