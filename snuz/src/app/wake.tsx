import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../styles/theme";
// import { useAudioPlayer } from "expo-audio";
import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function Wake() {
  const router = useRouter();
  // Create an audio player instance with the alarm sound
  // const player = useAudioPlayer(require("../../assets/audio/bear_roar.mp3"));

  useEffect(() => {
    // Start playing as soon as the screen loads
    // player.play();
    // Set it to loop
    // player.loop = true;

    return () => {
      // Cleanup when component unmounts
      // player.remove();
    };
  }, []);

  const handleStop = async () => {
    // await player.pause();
    // Navigate to game or verification screen
    router.push("/verify");
  };

  const handleSnooze = async () => {
    // await player.pause();
    // Add snooze logic here - maybe go back with a new timer
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Wakey wakey!</Text>
        <Text style={styles.time}>7:15</Text>

        <Pressable style={styles.snoozeButton} onPress={handleSnooze}>
          <Text style={styles.snoozeText}>Hit Snooze?</Text>
        </Pressable>

        <Image
          source={require("../../assets/images/snooze.png")}
          style={styles.bearImage}
          resizeMode="contain"
        />

        <Pressable style={styles.stopButton} onPress={handleStop}>
          <Text style={styles.stopText}>Stop</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 36,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xl,
  },
  time: {
    fontSize: 64,
    color: theme.colors.text.primary,
    fontWeight: "bold",
  },
  bearImage: {
    width: "80%",
    height: undefined,
    aspectRatio: 1,
  },
  snoozeButton: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: 25,
  },
  snoozeText: {
    color: theme.colors.text.primary,
    fontSize: 16,
  },
  stopButton: {
    backgroundColor: "#DC3545",
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: 25,
    marginBottom: theme.spacing.xl,
    width: "80%",
  },
  stopText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
