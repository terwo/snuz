import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../styles/theme";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Audio } from "expo-av";

export default function Snooze() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    if (timeLeft <= 0) {
      playAlarm();
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  async function playAlarm() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/audio/bear_roar.mp3"),
        { isLooping: true, shouldPlay: true }
      );
      return sound;
    } catch (error) {
      console.error("Error loading sound", error);
    }
  }

  const handleStop = () => {
    router.push("/complete?isSnooze=true");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>You hit Snooze</Text>
        <Text style={styles.time}>{formatTime(timeLeft)}</Text>

        <Image
          source={require("../../assets/images/snooze.gif")} // Add your GIF here
          style={styles.bearImage}
          resizeMode="contain"
        />

        <Text style={styles.subtitle}>Ouch... :( </Text>

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
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.text.primary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
  },
  time: {
    fontSize: 64,
    color: theme.colors.text.primary,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  bearImage: {
    width: "80%",
    height: undefined,
    aspectRatio: 1,
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
