import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../styles/theme";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { Pedometer } from "expo-sensors";
import { combineTypography } from "@/styles/typography";

const REQUIRED_STEPS = 55;

export default function Verify() {
  const router = useRouter();
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [subscription, setSubscription] = useState<any>(null);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);

  const handleComplete = useCallback(() => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
    router.push("/complete?isSnooze=false");
  }, [subscription, router]);

  const handleBack = useCallback(() => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
    router.back();
  }, [subscription, router]);

  useEffect(() => {
    if (currentStepCount >= REQUIRED_STEPS) {
      handleComplete();
    }
  }, [currentStepCount, handleComplete]);

  useEffect(() => {
    const checkPedometerAndSubscribe = async () => {
      try {
        const { status } = await Pedometer.requestPermissionsAsync();
        console.log("Pedometer permission status:", status);
        if (status !== "granted") {
          console.log("Pedometer permission not granted");
          return;
        }

        const isAvailable = await Pedometer.isAvailableAsync();
        console.log("Pedometer available:", isAvailable);
        setIsPedometerAvailable(isAvailable);

        if (isAvailable) {
          console.log("Starting step count subscription");
          const sub = Pedometer.watchStepCount((result) => {
            console.log("New step count:", result.steps);
            setCurrentStepCount((prev) => {
              const newCount = prev + result.steps;
              console.log("Updated total steps:", newCount);
              return newCount;
            });
          });
          setSubscription(sub);
        } else {
          console.log("Pedometer not available on this device");
        }
      } catch (error) {
        console.error("Error setting up pedometer:", error);
      }
    };

    checkPedometerAndSubscribe();

    return () => {
      console.log("Cleaning up pedometer subscription");
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.stepsContainer}>
          <Text style={styles.stepsNumber}>
            {Math.max(0, REQUIRED_STEPS - currentStepCount)}
          </Text>
          <Text style={styles.stepsText}>Steps left</Text>
        </View>

        {!isPedometerAvailable && (
          <Text style={styles.errorText}>
            Pedometer not available on this device
          </Text>
        )}

        <View style={styles.buttonContainer}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backText}>Back</Text>
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
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  stepsNumber: {
    fontSize: 96,
    color: theme.colors.text.primary,
    fontWeight: "bold",
  },
  stepsText: {
    fontSize: 24,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.sm,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    backgroundColor: "#F5F5F5",
    paddingVertical: theme.spacing.md,
    borderRadius: 25,
    width: "100%",
  },
  backText: {
    color: theme.colors.text.primary,
    fontSize: 16,
    textAlign: "center",
  },
  errorText: {
    color: "#DC3545",
    fontSize: 14,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
});
