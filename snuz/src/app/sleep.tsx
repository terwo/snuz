import { View, Text, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../styles/theme";
import { useEffect, useState } from "react";
import { combineTypography } from "@/styles/typography";

type BearStatus = {
  name: string;
  isAsleep: boolean;
};

const BunkBed = ({ bear, index }: { bear: BearStatus; index: number }) => {
  return (
    <View style={[styles.bunkLevel, { top: index * 120 }]}>
      <Image
        source={
          bear.isAsleep
            ? require("../../assets/images/bunk_sleep.png")
            : require("../../assets/images/bunk_awake.png")
        }
        style={styles.bunkImage}
        resizeMode="contain"
      />
      <Text style={combineTypography(theme.typography.title, styles.bearName)}>
        {bear.name}
      </Text>
    </View>
  );
};

export default function Sleep() {
  const router = useRouter();
  const [bears] = useState<BearStatus[]>([
    { name: "Alex", isAsleep: true },
    { name: "Sam", isAsleep: false },
    { name: "Jordan", isAsleep: true },
  ]);

  const [timeToAlarm, setTimeToAlarm] = useState(5); // Just 5 seconds for testing purposes

  useEffect(() => {
    if (timeToAlarm <= 0) {
      // Play a transition sound if desired
      router.push("/wake");
    }
    const timer = setInterval(() => {
      setTimeToAlarm((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeToAlarm]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      {/* Brown background with white radial gradient at bottom */}
      <View style={styles.background}>
        <LinearGradient
          colors={["transparent", "#FFFFFF"]}
          style={styles.radialGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={combineTypography(theme.typography.title, styles.title)}>
            ZZZ...
          </Text>
          <Text style={combineTypography(theme.typography.h2, styles.subtitle)}>
            Sweet dreams &lt;33
          </Text>

          <View style={styles.bunkBedContainer}>
            {bears.map((bear, index) => (
              <BunkBed key={index} bear={bear} index={index} />
            ))}
          </View>

          <View style={styles.alarmContainer}>
            <Text style={styles.alarmText}>Time until alarm:</Text>
            <Text style={styles.alarmTime}>{formatTime(timeToAlarm)}</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#4B361F",
  },
  radialGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "80%",
    opacity: 0.4,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    color: "#FFFFFF",
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  bunkBedContainer: {
    width: "100%",
    height: 360, // Height of three bunk beds
    position: "relative",
    marginVertical: theme.spacing.xl,
  },
  bunkLevel: {
    width: "100%",
    height: 120,
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
  },
  bunkImage: {
    height: "100%",
    aspectRatio: 1.5, // Adjust based on your image aspect ratio
  },
  bearName: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: theme.spacing.sm,
  },
  alarmContainer: {
    marginTop: "auto",
    alignItems: "center",
  },
  alarmText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: theme.spacing.xs,
  },
  alarmTime: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
});
