// app/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "../../hooks/useFonts";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export default function AppLayout() {
  const fontsLoaded = useFonts();

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background.menu,
        },
        headerTintColor: theme.colors.text.primary,
        tabBarStyle: {
          backgroundColor: theme.colors.background.menu,
          height: 70,
          paddingVertical: 12,
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.text.primary,
        tabBarIconStyle: {
          marginBottom: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 0,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "My Bear",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "bed" : "bed-outline"}
              color={color}
              size={28}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="group"
        options={{
          title: "Sleep Squad",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "alarm" : "alarm-outline"}
              color={color}
              size={28}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              color={color}
              size={28}
            />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
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
