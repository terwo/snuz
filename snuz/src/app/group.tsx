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
import { theme } from '../styles/theme';
import { combineTypography } from '../styles/typography';

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
          <Text style={combineTypography(theme.typography.h2, styles.alarmHeader)}>
            Squad Alarm 🚨
          </Text>
          <Text style={combineTypography(theme.typography.title, styles.alarmTime)}>
            7:30 AM
          </Text>
          <Text style={combineTypography(theme.typography.p, styles.alarmInfo)}>
            Tomorrow • 3 squad members
          </Text>
        </View>

        {/* Set New Alarm Button */}
        <TouchableOpacity
          style={styles.setAlarmButton}
          onPress={() => setShowPicker(true)}
        >
          <Ionicons name="alarm-outline" size={24} color={theme.colors.background.white} />
          <Text style={combineTypography(theme.typography.p, styles.setAlarmText)}>
            Set Squad Alarm
          </Text>
        </TouchableOpacity>

        {/* Squad Members Header */}
        <Text style={combineTypography(theme.typography.h2, styles.sectionHeader)}>
          Squad Members
        </Text>

        {/* Squad Members List */}
        <View style={styles.membersContainer}>
          <View style={styles.memberRow}>
            <View style={styles.memberAvatar}>
              <Text style={styles.avatarText}>RD</Text>
            </View>
            <View style={styles.memberInfo}>
              <Text style={combineTypography(theme.typography.h3, styles.memberName)}>
                Robbie Dunn
              </Text>
              <Text style={combineTypography(theme.typography.p, styles.memberStatus)}>
                Ready for bed 😴
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Time Picker Modal */}
      {showPicker && (
        <AlarmPicker
          visible={showPicker}
          onClose={() => setShowPicker(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.main,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  alarmContainer: {
    backgroundColor: theme.colors.background.menu,
    borderRadius: 16,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  alarmHeader: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  alarmTime: {
    color: theme.colors.text.primary,
    marginVertical: theme.spacing.xs,
  },
  alarmInfo: {
    color: theme.colors.text.primary,
  },
  setAlarmButton: {
    backgroundColor: theme.colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: 12,
    marginBottom: theme.spacing.xl,
  },
  setAlarmText: {
    color: theme.colors.background.white,
    marginLeft: theme.spacing.sm,
  },
  sectionHeader: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  membersContainer: {
    backgroundColor: theme.colors.background.menu,
    borderRadius: 16,
    padding: theme.spacing.md,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  avatarText: {
    color: theme.colors.background.white,
    fontSize: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  memberStatus: {
    color: theme.colors.text.primary,
  },
});
