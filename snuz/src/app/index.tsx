// app/welcome.tsx
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../styles/theme";
import { combineTypography } from "../styles/typography";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useAuth } from "../context/auth";

export default function Welcome() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      await login(name.trim());
      router.replace("/(tabs)/");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={combineTypography(theme.typography.title, styles.title)}>
          This is Snuz
        </Text>

        <Text style={combineTypography(theme.typography.h2, styles.subtitle)}>
          your daily wake-up companion
        </Text>

        <Image
          source={require("../../assets/images/snooze.png")}
          style={styles.bearImage}
          resizeMode="contain"
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor={"grey"}
            value={name}
            onChangeText={setName}
          />

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              isLoading && styles.buttonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Loading..." : "Continue"}
            </Text>
          </Pressable>

          {error ? (
            <Text
              style={combineTypography(theme.typography.p, styles.errorText)}
            >
              {error}
            </Text>
          ) : null}
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
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xl,
    textAlign: "center",
  },
  bearImage: {
    width: "80%",
    height: undefined,
    aspectRatio: 1,
    marginBottom: theme.spacing.xl,
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "90%",
    backgroundColor: theme.colors.background.menu,
    borderRadius: 25,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  button: {
    backgroundColor: theme.colors.text.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    marginVertical: theme.spacing.md,
    borderRadius: 25,
    width: "90%",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    // backgroundColor: theme.colors.text.disabled,
    backgroundColor: "grey",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    marginTop: theme.spacing.md,
  },
});
