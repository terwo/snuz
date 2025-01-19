// app/index.tsx
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from '../styles/theme';
import { combineTypography } from '../styles/typography';

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Bear display will go here */}
        <View style={styles.bearContainer}>
          <Text style={styles.bearEmoji}>🐻</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={combineTypography(theme.typography.h1, styles.greeting)}>
            Good Evening! 🌙
          </Text>
          <Text style={combineTypography(theme.typography.p, styles.subtitle)}>
            Your bear is getting sleepy...
          </Text>
          <Text style={combineTypography(theme.typography.h3, styles.streakText)}>
            Sleep consistency streak: 5 days 🔥
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.main,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  bearContainer: {
    width: 256,
    height: 256,
    backgroundColor: theme.colors.background.menu,
    borderRadius: 128,
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bearEmoji: {
    fontSize: 36,
  },
  textContainer: {
    width: '100%',
    maxWidth: 300,
  },
  greeting: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  streakText: {
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
});
