import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import AlarmPicker from "../components/AlarmPicker";
import { registerForPushNotificationsAsync } from "../utils/notificationConfig";
import { theme } from '../styles/theme';
import { combineTypography } from '../styles/typography';

// Dummy data for the group
const dummyGroupData = {
  hasAlarm: true, // Toggle this to test different states
  commitmentDays: 7,
  members: [
    { id: 1, name: "Jason", score: 597, avatar: "🐻" },
    { id: 2, name: "Jason", score: 597, avatar: "🐻" },
    { id: 3, name: "Jason", score: 597, avatar: "🐻" },
    { id: 4, name: "Jason", score: 597, avatar: "🐻" },
  ],
  wakeUpTime: "7:15 AM",
  sleepTime: "7:15 PM"
};

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

  const renderNoAlarmState = () => (
    <View style={styles.content}>
      <View style={styles.bearContainer}>
        <Text style={styles.bearEmoji}>🐻</Text>
      </View>

      <View style={styles.textContainer}>
        <Text style={combineTypography(theme.typography.h1, styles.greeting)}>
          No Squad Alarm
        </Text>
        <Text style={combineTypography(theme.typography.p, styles.subtitle)}>
          Create a squad alarm to start sleeping better together!
        </Text>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setShowPicker(true)}
      >
        <Ionicons name="add" size={30} color={theme.colors.background.white} />
      </TouchableOpacity>
    </View>
  );

  const renderAlarmState = () => (
    <View style={styles.content}>
      <Text style={combineTypography(theme.typography.title, styles.title)}>
        Sleep Plan
      </Text>

      <View style={styles.commitmentContainer}>
        <Text style={combineTypography(theme.typography.p, styles.commitmentText)}>
          committed with
        </Text>
        <View style={styles.avatarGroup}>
          {dummyGroupData.members.slice(0, 3).map((member, index) => (
            <View 
              key={member.id} 
              style={[
                styles.avatarCircle,
                { marginLeft: index > 0 ? -15 : 0 }
              ]}
            >
              <Text>{member.avatar}</Text>
            </View>
          ))}
        </View>
        <Text style={combineTypography(theme.typography.p, styles.commitmentText)}>
          for {dummyGroupData.commitmentDays} days
        </Text>
      </View>

      <View style={styles.timesContainer}>
        <View style={styles.timeBlock}>
          <Text style={combineTypography(theme.typography.p, styles.timeLabel)}>
            Wake up at
          </Text>
          <Text style={combineTypography(theme.typography.h1, styles.timeValue)}>
            {dummyGroupData.wakeUpTime}
          </Text>
        </View>

        <View style={styles.timeBlock}>
          <Text style={combineTypography(theme.typography.p, styles.timeLabel)}>
            Sleep at
          </Text>
          <Text style={combineTypography(theme.typography.h1, styles.timeValue)}>
            {dummyGroupData.sleepTime}
          </Text>
        </View>
      </View>

      <View style={styles.rankingsContainer}>
        <Text style={combineTypography(theme.typography.h2, styles.rankingsTitle)}>
          Rankings
        </Text>
        {dummyGroupData.members.map((member, index) => (
          <View key={member.id} style={[
            styles.rankingRow,
            index === 1 && styles.selectedRank
          ]}>
            <Text style={styles.rankNumber}>{index + 1}</Text>
            <View style={styles.rankAvatar}>
              <Text>{member.avatar}</Text>
            </View>
            <Text style={combineTypography(theme.typography.p, styles.rankName)}>
              {member.name}
            </Text>
            <Text style={combineTypography(theme.typography.p, styles.rankScore)}>
              {member.score}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {dummyGroupData.hasAlarm ? renderAlarmState() : renderNoAlarmState()}

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
  title: {
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  bearContainer: {
    width: 256,
    height: 256,
    backgroundColor: theme.colors.background.menu,
    borderRadius: 128,
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  bearEmoji: {
    fontSize: 36,
  },
  textContainer: {
    alignItems: 'center',
  },
  greeting: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  commitmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
    flexWrap: 'wrap',
  },
  commitmentText: {
    color: theme.colors.text.primary,
    marginHorizontal: theme.spacing.xs,
  },
  avatarGroup: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.xs,
  },
  avatarCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.background.menu,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.background.white,
  },
  timesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.background.white,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#FFE600',
  },
  timeBlock: {
    alignItems: 'center',
  },
  timeLabel: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  timeValue: {
    color: theme.colors.text.primary,
  },
  rankingsContainer: {
    backgroundColor: theme.colors.background.menu,
    borderRadius: 16,
    padding: theme.spacing.md,
  },
  rankingsTitle: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  rankingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderRadius: 8,
  },
  selectedRank: {
    backgroundColor: theme.colors.background.white,
  },
  rankNumber: {
    width: 24,
    color: theme.colors.text.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  rankAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  rankName: {
    flex: 1,
    color: theme.colors.text.primary,
  },
  rankScore: {
    color: theme.colors.text.primary,
  },
});
