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
          <Text style={styles.title}>Good Evening! 🌙</Text>
          <Text style={styles.subtitle}>Your bear is getting sleepy...</Text>
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
    backgroundColor: "#0f172a", // bg-slate-900
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16, // p-4
  },
  bearContainer: {
    width: 256, // w-64
    height: 256, // h-64
    backgroundColor: "#1e293b", // bg-slate-800
    borderRadius: 128, // rounded-full (half of width/height)
    marginBottom: 32, // mb-8
    alignItems: "center",
    justifyContent: "center",
  },
  bearEmoji: {
    fontSize: 36, // text-4xl
  },
  textContainer: {
    width: "100%",
    maxWidth: 384, // max-w-sm
  },
  title: {
    fontSize: 24, // text-2xl
    fontWeight: "bold",
    color: "#ffffff", // text-white
    marginBottom: 8, // mb-2
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18, // text-lg
    color: "#d1d5db", // text-gray-300
    textAlign: "center",
  },
  streakText: {
    fontSize: 14, // text-sm
    color: "#9ca3af", // text-gray-400
    textAlign: "center",
    marginTop: 8, // mt-2
  },
});
