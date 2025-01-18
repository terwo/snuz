// app/index.tsx
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Bear display will go here */}
        <View style={styles.bearContainer}>
          <Text style={styles.bearEmoji}>🐻</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Good Evening! 🌙
          </Text>
          <Text style={styles.subtitle}>
            Your bear is getting sleepy...
          </Text>
          <Text style={styles.streakText}>
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
    backgroundColor: '#1e293b',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  bearContainer: {
    width: 256,
    height: 256,
    backgroundColor: '#334155',
    borderRadius: 128,
    marginBottom: 32,
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
  title: {
    fontSize: 24,
    fontFamily: 'Corben',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Geist',
    color: '#d1d5db',
    textAlign: 'center',
  },
  streakText: {
    fontSize: 14,
    fontFamily: 'Geist',
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
  },
});
