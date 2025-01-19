// app/_layout.tsx
import { Stack } from "expo-router";
import { useFonts } from "../hooks/useFonts";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../styles/theme";
import { GroupProvider } from "../context/group";
import { AuthProvider } from "../context/auth";
import { UserProvider } from "../context/user";
import { WebSocketProvider } from "../context/websocket";
import * as Notifications from 'expo-notifications';
import { useEffect } from "react";
import { registerForPushNotificationsAsync } from "../utils/notificationConfig";

// Set up notifications handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const fontsLoaded = useFonts();

  useEffect(() => {
    // Register for push notifications when the app starts
    registerForPushNotificationsAsync();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <WebSocketProvider>
        <GroupProvider>
          <UserProvider>
            <Stack screenOptions={{ headerShown: false }}>
              {/* <Stack.Screen name="index" /> */}
              <Stack.Screen name="(tabs)" />
            </Stack>
          </UserProvider>
        </GroupProvider>
      </WebSocketProvider>
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