// app/group.tsx
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import AlarmPicker from "../components/AlarmPicker";

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Group() {
  const [showPicker, setShowPicker] = useState(false);
  const [permission, setPermission] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    setPermission(finalStatus === "granted");
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="p-4 flex items-center">
        {/* Current Group Alarm */}
        <View className="bg-slate-800 rounded-xl p-4 mb-4 w-full items-center">
          <Text className="text-white text-lg font-bold mb-2 bg-slate-700 px-6 py-2 rounded-full text-center">
            Squad Alarm 🚨
          </Text>
          <Text className="text-3xl text-white font-bold mb-2">7:30 AM</Text>
          <Text className="text-gray-400 bg-slate-700 px-4 py-1.5 rounded-full text-center">
            Tomorrow • 3 squad members
          </Text>
        </View>

        {/* Set New Alarm Button */}
        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-xl flex-row items-center justify-center mb-4 w-full"
          onPress={() => setShowPicker(true)}
        >
          <Ionicons name="alarm-outline" size={24} color="white" />
          <Text className="text-white font-bold ml-2">Set Squad Alarm</Text>
        </TouchableOpacity>

        {/* Squad Members Header */}
        <Text className="text-white text-lg font-bold mb-4 bg-slate-700 px-6 py-2 rounded-full text-center">
          Squad Members
        </Text>

        {/* Squad Members List */}
        <View className="bg-slate-800 rounded-xl p-4 w-full">
          <View className="flex-row items-center justify-center mb-2">
            <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center">
              <Text>🐻</Text>
            </View>
            <View className="ml-3 items-center">
              <Text className="text-white bg-slate-700 px-4 py-1.5 rounded-full text-center">
                Sarah
              </Text>
              <Text className="text-gray-400 bg-slate-700 px-4 py-1.5 rounded-full mt-2 text-center">
                Ready for bed 😴
              </Text>
            </View>
          </View>
        </View>
      </View>

      <AlarmPicker
        isVisible={showPicker}
        onClose={() => setShowPicker(false)}
      />
    </SafeAreaView>
  );
}
