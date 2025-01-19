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
import { theme } from '../styles/theme';
import { combineTypography } from '../styles/typography';

interface AlarmPickerProps {
  visible: boolean;
  onClose: () => void;
}

export default function AlarmPicker({ visible, onClose }: AlarmPickerProps) {
  const [date, setDate] = useState(new Date());

  const handleScheduleAlarm = async (selectedDate: Date) => {
    const success = await scheduleAlarm(selectedDate);
    if (success) {
      alert("Alarm set successfully! 🚨");
      onClose();
    }
  };

  if (Platform.OS === "ios") {
    return (
      <Modal visible={visible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.contentContainer}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose}>
                <Text style={combineTypography(theme.typography.p, styles.buttonText)}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <Text style={combineTypography(theme.typography.h2, styles.title)}>
                Set Squad Alarm
              </Text>
              <TouchableOpacity onPress={() => handleScheduleAlarm(date)}>
                <Text style={combineTypography(theme.typography.p, styles.buttonText)}>
                  Set
                </Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={date}
              mode="time"
              display="spinner"
              onChange={(event, selectedDate) => {
                setDate(selectedDate || date);
              }}
              textColor={theme.colors.text.primary}
            />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.contentContainer}>
          <Text style={combineTypography(theme.typography.h2, styles.title)}>
            Set Squad Alarm
          </Text>
          <DateTimePicker
            value={date}
            mode="time"
            display="default"
            onChange={(event, selectedDate) => {
              if (event.type === "set") {
                setDate(selectedDate || date);
                handleScheduleAlarm(selectedDate || date);
              } else {
                onClose();
              }
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  contentContainer: {
    backgroundColor: theme.colors.background.main,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  title: {
    color: theme.colors.text.primary,
    textAlign: "center",
  },
  buttonText: {
    color: theme.colors.accent,
  },
});
