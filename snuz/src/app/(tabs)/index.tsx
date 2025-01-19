import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../styles/theme";
import { combineTypography } from "../../styles/typography";
import { useAuth } from "../../context/auth";
import { useGroup } from "../../context/group";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function Home() {
  const { username } = useAuth();
  const { group, getGroup } = useGroup();
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(15);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        await getGroup(username);
      } catch (error) {
        console.error("Failed to fetch group data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupData();
  }, [username, getGroup]);

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

  const createNewPlan = () => {
    router.push("/group");
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!group) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={combineTypography(theme.typography.title, styles.title)}>
            Hi {username}!
          </Text>

          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeText}>
              My name's Snooze, nice to meet you. Let's get you set up with a
              sleep plan :p
            </Text>

            <Image
              source={require("../../../assets/images/snooze.png")}
              style={styles.welcomeBearImage}
              resizeMode="contain"
            />

            <Pressable style={styles.createPlanButton} onPress={createNewPlan}>
              <Text style={styles.createPlanButtonText}>Create New Plan</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={combineTypography(theme.typography.title, styles.title)}>
          Mornin' {username}!
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
    backgroundColor: theme.colors.background.main,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  title: {
    color: theme.colors.text.primary,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  welcomeContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.md,
  },
  welcomeText: {
    textAlign: "center",
    color: theme.colors.text.primary,
    fontSize: 16,
    marginBottom: theme.spacing.xl,
  },
  welcomeBearImage: {
    width: "80%",
    height: 300,
    aspectRatio: 1,
    marginBottom: theme.spacing.xl,
  } as const,
  createPlanButton: {
    // backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: 25,
    marginTop: "auto",
  },
  createPlanButtonText: {
    // color: theme.colors.text.white,
    fontSize: 16,
    fontWeight: "600",
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
  },
  status: {
    fontSize: 16,
    color: "#666666",
    marginTop: theme.spacing.lg,
  },
  timer: {
    fontSize: 18,
    color: "#333333",
  },
  bearImage: {
    width: "80%",
    height: 300,
    aspectRatio: 1,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  } as const,
  message: {
    fontSize: 16,
    color: "#666666",
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  sleepButton: {
    backgroundColor: theme.colors.background.main,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: 25,
  },
  sleepButtonText: {
    color: theme.colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
