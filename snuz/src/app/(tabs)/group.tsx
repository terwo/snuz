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
import { registerForPushNotificationsAsync } from "../../utils/notificationConfig";
import { theme } from "../../styles/theme";
import { combineTypography } from "../../styles/typography";
import { router } from "expo-router";
import { useGroup } from '../../context/group';
import { useAuth } from '../../context/auth';

export default function Group() {
  const { group } = useGroup();
  const { username } = useAuth();
  const [permission, setPermission] = useState(false);

  useEffect(() => {
    async function setupNotifications() {
      const permission = await registerForPushNotificationsAsync();
      setPermission(permission);
    }
    setupNotifications();
  }, []);

  useEffect(() => {
    console.log('Current group data:', group);
  }, [group]);

  const formatTime = (date: Date) => {
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    const [time, period] = timeStr.split(' ');
    return { time, period };
  };

  const renderTimeValue = (timestamp: string | undefined) => {
    if (!timestamp) return { time: '--:--', period: '' };
    return formatTime(new Date(timestamp));
  };

  const renderNoAlarmState = () => (
    <View style={styles.content}>
      <Text style={combineTypography(theme.typography.title, styles.title)}>
        Sleep Plan
      </Text>

      <Image
        source={require("../../../assets/images/snooze_behind.png")}
        style={styles.welcomeBearImage}
        resizeMode="contain"
      />

      <View style={styles.textContainer}>
        <Text style={combineTypography(theme.typography.p, styles.subtitle)}>
          Where's your plan?
        </Text>
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/new-plan")}
      >
        <Ionicons name="add" size={30} color={theme.colors.background.white} />
      </TouchableOpacity>
    </View>
  );

  const renderAlarmState = () => {
    if (!group || !group.members) {
      console.log('No group data available:', group);
      return renderNoAlarmState();
    }

    console.log('Rendering alarm state with group:', group);

    return (
      <View style={styles.content}>
        <Text style={combineTypography(theme.typography.title, styles.title)}>
          Sleep Plan
        </Text>

        <View style={styles.commitmentContainer}>
          <Text
            style={combineTypography(theme.typography.p, styles.commitmentText)}
          >
            committed with {group.members.length - 1} others
          </Text>
          <Text
            style={combineTypography(theme.typography.p, styles.commitmentText)}
          >
            for {group.days_left} days
          </Text>
        </View>

        <View style={styles.timesContainer}>
          <View style={styles.timeBlock}>
            <Text style={combineTypography(theme.typography.p, styles.timeLabel)}>
              Wake up at
            </Text>
            <View style={styles.timeValueContainer}>
              <Text style={styles.timeValue}>
                {renderTimeValue(group.wake_time).time}
              </Text>
              <Text style={styles.timePeriod}>
                {renderTimeValue(group.wake_time).period}
              </Text>
            </View>
          </View>

          <View style={styles.timeBlock}>
            <Text style={combineTypography(theme.typography.p, styles.timeLabel)}>
              Sleep at
            </Text>
            <View style={styles.timeValueContainer}>
              <Text style={styles.timeValue}>
                {renderTimeValue(group.sleep_time).time}
              </Text>
              <Text style={styles.timePeriod}>
                {renderTimeValue(group.sleep_time).period}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.rankingsContainer}>
          <Text style={styles.rankingsTitle}>Rankings</Text>
          {group.members.map((member, index) => (
            <View key={member} style={[
              styles.rankingRow,
              member === username && styles.selectedRank
            ]}>
              <Text style={styles.rankNumber}>{index + 1}</Text>
              <View style={styles.rankAvatar}>
                <Text>🐻</Text>
              </View>
              <Text style={styles.rankName}>{member}</Text>
              <Text style={styles.rankScore}>597</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {!group ? renderNoAlarmState() : renderAlarmState()}
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
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  welcomeBearImage: {
    width: "100%",
    height: 300,
    aspectRatio: 1,
  } as const,
  textContainer: {
    alignItems: "center",
    marginTop: theme.spacing.lg,
  },
  subtitle: {
    color: theme.colors.text.primary,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing.xl,
    right: theme.spacing.xl,
    // backgroundColor: theme.colors.primary.main,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  commitmentContainer: {
    marginBottom: theme.spacing.lg,
  },
  commitmentText: {
    color: theme.colors.text.primary,
    textAlign: "center",
  },
  timesContainer: {
    marginBottom: theme.spacing.xl,
  },
  timeBlock: {
    marginBottom: theme.spacing.lg,
  },
  timeLabel: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  timeValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  timeValue: {
    fontSize: 36,
    color: theme.colors.text.primary,
    fontWeight: "600",
  },
  timePeriod: {
    fontSize: 16,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.xs,
  },
  rankingsContainer: {
    flex: 1,
  },
  rankingsTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  rankingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    borderRadius: 8,
  },
  selectedRank: {
    backgroundColor: theme.colors.background.selected,
  },
  rankNumber: {
    width: 30,
    color: theme.colors.text.primary,
  },
  rankAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.background.avatar,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  rankName: {
    flex: 1,
    color: theme.colors.text.primary,
  },
  rankScore: {
    color: theme.colors.text.primary,
    fontWeight: "600",
  },
});
