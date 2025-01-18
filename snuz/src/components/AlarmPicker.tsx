import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { scheduleAlarm } from "../utils/notificationConfig";

export default function AlarmPicker({ isVisible, onClose }) {
  const [date, setDate] = useState(new Date());

  const handleScheduleAlarm = async (selectedDate) => {
    const success = await scheduleAlarm(selectedDate);
    if (success) {
      alert("Alarm set successfully! 🚨");
      onClose();
    }
  };

  if (Platform.OS === "ios") {
    return (
      <Modal visible={isVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.contentContainer}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Set Squad Alarm</Text>
              <TouchableOpacity onPress={() => handleScheduleAlarm(date)}>
                <Text style={styles.buttonText}>Set</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={date}
              mode="time"
              display="spinner"
              onChange={(event, selectedDate) => {
                setDate(selectedDate || date);
              }}
              textColor="#000000"
            />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    isVisible && (
      <DateTimePicker
        value={date}
        mode="time"
        is24Hour={true}
        onChange={(event, selectedDate) => {
          onClose();
          if (selectedDate) {
            handleScheduleAlarm(selectedDate);
          }
        }}
        textColor="#000000"
      />
    )
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  contentContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  buttonText: {
    fontSize: 18,
    color: "#3b82f6",
  },
});
