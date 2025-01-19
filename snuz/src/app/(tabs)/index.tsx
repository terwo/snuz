// app/index.tsx
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../styles/theme";
import { combineTypography } from "../../styles/typography";
import { useAuth } from "../../context/auth";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function Home() {
  const { username } = useAuth();
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  const goToSleep = () => {
    router.push("/sleep");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={combineTypography(theme.typography.title, styles.title)}>
          Mornin' {username}
        </Text>

        <View style={styles.mainContent}>
          <Text style={combineTypography(theme.typography.h2, styles.status)}>
            Sleeping in
          </Text>
          <Text style={styles.timer}>{formatTime(timeLeft)}</Text>

          <Image
            source={require("../../../assets/images/snooze.png")}
            style={styles.bearImage}
            resizeMode="contain"
          />

          <Text style={styles.message}>Let's have a great day.</Text>

          <Pressable style={styles.sleepButton} onPress={goToSleep}>
            <Text style={styles.sleepButtonText}>Go to sleep</Text>
          </Pressable>
        </View>
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
  },
  title: {
    color: theme.colors.text.primary,
    textAlign: "center",
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
  },
  status: {
    fontSize: 16,
    color: "#666666",
  },
  timer: {
    fontSize: 18,
    color: "#333333",
  },
  bearImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
  },
  message: {
    fontSize: 16,
    color: "#666666",
  },
  sleepButton: {
    backgroundColor: theme.colors.background.menu,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 25,
    marginTop: theme.spacing.md,
  },
  sleepButtonText: {
    color: theme.colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
