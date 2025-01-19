// app/_layout.tsx
import { Stack } from "expo-router";
import { useFonts } from "../hooks/useFonts";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../styles/theme";
import { GroupProvider } from "../context/group";
import { AuthProvider } from "../context/auth";

export default function RootLayout() {
  const fontsLoaded = useFonts();

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <GroupProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="index" /> */}
        <Stack.Screen name="(tabs)" />
      </Stack>
      </GroupProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background.main,
  },
  loadingText: {
    color: theme.colors.text.primary,
  },
});