import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import AlarmPicker from "../components/AlarmPicker";
import { registerForPushNotificationsAsync } from "../utils/notificationConfig";

export default function Group() {
  const [showPicker, setShowPicker] = useState(false);
  const [permission, setPermission] = useState(false);

  useEffect(() => {
    async function setupNotifications() {
      const hasPermission = await registerForPushNotificationsAsync();
      setPermission(hasPermission);
    }
    setupNotifications();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Current Group Alarm */}
        <View style={styles.alarmContainer}>
          <Text style={styles.alarmHeader}>Squad Alarm 🚨</Text>
          <Text style={styles.alarmTime}>7:30 AM</Text>
          <Text style={styles.alarmInfo}>Tomorrow • 3 squad members</Text>
        </View>

        {/* Set New Alarm Button */}
        <TouchableOpacity
          style={styles.setAlarmButton}
          onPress={() => setShowPicker(true)}
        >
          <Ionicons name="alarm-outline" size={24} color="white" />
          <Text style={styles.setAlarmText}>Set Squad Alarm</Text>
        </TouchableOpacity>

        {/* Squad Members Header */}
        <Text style={styles.sectionHeader}>Squad Members</Text>

        {/* Squad Members List */}
        <View style={styles.membersContainer}>
          <View style={styles.memberRow}>
            <View style={styles.memberAvatar}>
              <Text>🐻</Text>
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>Sarah</Text>
              <Text style={styles.memberStatus}>Ready for bed 😴</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#475569", // bg-slate-600
  },
  content: {
    padding: 16, // p-4
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  alarmContainer: {
    backgroundColor: "#1e293b", // bg-slate-800
    borderRadius: 12, // rounded-xl
    padding: 16, // p-4
    marginBottom: 16, // mb-4
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  alarmHeader: {
    color: "white",
    fontSize: 18, // text-lg
    fontWeight: "bold",
    marginBottom: 8, // mb-2
    backgroundColor: "#334155", // bg-slate-700
    paddingHorizontal: 24, // px-6
    paddingVertical: 8, // py-2
    borderRadius: 9999, // rounded-full
    textAlign: "center",
  },
  alarmTime: {
    fontSize: 30, // text-3xl
    color: "white",
    fontWeight: "bold",
    marginBottom: 8, // mb-2
  },
  alarmInfo: {
    color: "#9ca3af", // text-gray-400
    backgroundColor: "#334155", // bg-slate-700
    paddingHorizontal: 16, // px-4
    paddingVertical: 6, // py-1.5
    borderRadius: 9999, // rounded-full
    textAlign: "center",
  },
  setAlarmButton: {
    backgroundColor: "#3b82f6", // bg-blue-500
    padding: 16, // p-4
    borderRadius: 12, // rounded-xl
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16, // mb-4
    width: "100%",
  },
  setAlarmText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8, // ml-2
  },
  sectionHeader: {
    color: "white",
    fontSize: 18, // text-lg
    fontWeight: "bold",
    marginBottom: 16, // mb-4
    backgroundColor: "#334155", // bg-slate-700
    paddingHorizontal: 24, // px-6
    paddingVertical: 8, // py-2
    borderRadius: 9999, // rounded-full
    textAlign: "center",
  },
  membersContainer: {
    backgroundColor: "#1e293b", // bg-slate-800
    borderRadius: 12, // rounded-xl
    padding: 16, // p-4
    width: "100%",
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8, // mb-2
  },
  memberAvatar: {
    width: 40, // w-10
    height: 40, // h-10
    backgroundColor: "#3b82f6", // bg-blue-500
    borderRadius: 20, // rounded-full
    alignItems: "center",
    justifyContent: "center",
  },
  memberInfo: {
    marginLeft: 12, // ml-3
    alignItems: "center",
  },
  memberName: {
    color: "white",
    backgroundColor: "#334155", // bg-slate-700
    paddingHorizontal: 16, // px-4
    paddingVertical: 6, // py-1.5
    borderRadius: 9999, // rounded-full
    textAlign: "center",
  },
  memberStatus: {
    color: "#9ca3af", // text-gray-400
    backgroundColor: "#334155", // bg-slate-700
    paddingHorizontal: 16, // px-4
    paddingVertical: 6, // py-1.5
    borderRadius: 9999, // rounded-full
    marginTop: 8, // mt-2
    textAlign: "center",
  },
});
