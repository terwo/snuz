import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../styles/theme";
import { useRouter, useLocalSearchParams } from "expo-router";
import { combineTypography } from "@/styles/typography";

export default function Complete() {
  const router = useRouter();
  const { isSnooze } = useLocalSearchParams<{ isSnooze: string }>();

  const handleFinish = () => {
    router.replace("/(tabs)/");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={combineTypography(theme.typography.title, styles.title)}>
          {isSnooze === "true" ? "Alarm stopped" : "Morninggg"}
        </Text>
        <Text style={combineTypography(theme.typography.h3, styles.subtitle)}>
          {isSnooze === "true"
            ? "But at what cost..."
            : "Rise n' shine, thanks for not hitting Snooze!"}
        </Text>

        <Image
          source={
            isSnooze === "true"
              ? require("../../assets/images/snooze_injured.png")
              : require("../../assets/images/snooze_healthy.png")
          }
          style={styles.bearImage}
          resizeMode="contain"
        />

        <Pressable style={styles.finishButton} onPress={handleFinish}>
          <Text style={styles.finishText}>Finish</Text>
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
  },
  title: {
    fontSize: 36,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.sm,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
  },
  bearImage: {
    width: "80%",
    height: undefined,
    aspectRatio: 1,
    marginVertical: 100,
    paddingVertical: theme.spacing.md,
  },
  finishButton: {
    backgroundColor: "#DC3545",
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: 25,
    marginTop: "auto",
    marginBottom: theme.spacing.xl,
    width: "80%",
  },
  finishText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
