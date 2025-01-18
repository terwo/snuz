// app/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "../hooks/useFonts";
import { View, Text, StyleSheet } from "react-native";

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
          backgroundColor: "#1e293b",
        },
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#1e293b",
        },
        tabBarActiveTintColor: "#3b82f6",
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
              size={24}
            />
          ),
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
              size={24}
            />
          ),
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
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
  },
  loadingText: {
    color: '#ffffff',
  }
});
