// app/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AppLayout() {
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
