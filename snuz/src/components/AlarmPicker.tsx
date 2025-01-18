// components/AlarmPicker.tsx
import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";

// Set up notifications handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function AlarmPicker({ isVisible, onClose }) {
  const [date, setDate] = useState(new Date());

  const scheduleAlarm = async (selectedDate) => {
    // Request permissions
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Need notification permissions to set alarms!");
      return;
    }

    // Cancel any existing alarms
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule the new alarm
    const trigger = new Date(selectedDate);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Wake Up! 🐻",
        body: "Time to start the day with your bear squad!",
        sound: true,
      },
      trigger,
    });

    alert("Alarm set successfully! 🚨");
    onClose();
  };

  if (Platform.OS === "ios") {
    return (
      <Modal visible={isVisible} transparent={true} animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl">
            <View className="p-4 flex-row justify-between items-center border-b border-gray-200">
              <TouchableOpacity onPress={onClose}>
                <Text className="text-blue-500 text-lg">Cancel</Text>
              </TouchableOpacity>
              <Text className="text-lg font-semibold">Set Squad Alarm</Text>
              <TouchableOpacity onPress={() => scheduleAlarm(date)}>
                <Text className="text-blue-500 text-lg">Set</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={date}
              mode="time"
              display="spinner"
              onChange={(event, selectedDate) => {
                setDate(selectedDate || date);
              }}
            />
          </View>
        </View>
      </Modal>
    );
  }

  // Android uses the native time picker
  return (
    isVisible && (
      <DateTimePicker
        value={date}
        mode="time"
        is24Hour={true}
        onChange={(event, selectedDate) => {
          onClose();
          if (selectedDate) {
            scheduleAlarm(selectedDate);
          }
        }}
      />
    )
  );
}
