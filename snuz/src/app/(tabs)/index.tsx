// app/index.tsx
import { View, Text, StyleSheet, Image } from "react-native"; // Import the Image component
import { useAuth } from '../../context/auth';

import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../styles/theme";
import { combineTypography } from "../../styles/typography";

export default function Home() {
  const { username } = useAuth(); // Get the authenticated username

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
          <Text style={styles.timer}>00:00:00</Text>

          <Image
            source={require("../../../assets/images/snooze.png")} // You'll need the actual bear illustration
            style={styles.bearImage}
            resizeMode="contain"
          />

          <Text style={styles.message}>Let's have a great day.</Text>
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
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
    textAlign: "center",
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
  },
  status: {
    fontSize: 16,
    color: "#666666",
    marginBottom: theme.spacing.sm,
  },
  timer: {
    fontSize: 18,
    color: "#333333",
    // marginBottom: theme.spacing.md,
  },
  bearImage: {
    width: "100%", // Will take up 80% of the parent container width
    height: undefined, // Let height adjust automatically
    aspectRatio: 1, // Maintain 1:1 aspect ratio
    // marginVertical: theme.spacing.xl,
  },
  message: {
    fontSize: 16,
    color: "#666666",
    marginTop: theme.spacing.xl,
  },
});
