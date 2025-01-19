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

export default function Group() {
  const { group } = useGroup();
  const [permission, setPermission] = useState(false);

  useEffect(() => {
    async function setupNotifications() {
      const permission = await registerForPushNotificationsAsync();
      setPermission(permission);
    }
    setupNotifications();
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderNoAlarmState = () => (
    <View style={styles.content}>
      <Text style={combineTypography(theme.typography.title, styles.title)}>
        Sleep Plan
      </Text>

      <Image
        source={require("../../../assets/images/snooze_behind.png")}
        style={{
          width: '100%',
          height: undefined,
          aspectRatio: 1,
        }}
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

  const renderAlarmState = () => (
    <View style={styles.content}>
      <Text style={combineTypography(theme.typography.title, styles.title)}>
        Sleep Plan
      </Text>

      <View style={styles.commitmentContainer}>
        <Text style={combineTypography(theme.typography.p, styles.commitmentText)}>
          committed with {group?.members.length ? group.members.length - 1 : 0} others
        </Text>
        <Text style={combineTypography(theme.typography.p, styles.commitmentText)}>
          for {group?.days_left} days
        </Text>
      </View>

      <View style={styles.timesContainer}>
        <View style={styles.timeBlock}>
          <Text style={combineTypography(theme.typography.p, styles.timeLabel)}>
            Wake up at
          </Text>
          <View style={styles.timeValueContainer}>
            <Text style={combineTypography(theme.typography.timeValue, styles.timeValue)}>
              {group?.wake_time ? formatTime(new Date(group.wake_time)) : '--:--'}
            </Text>
          </View>
        </View>

        <View style={styles.timeBlock}>
          <Text style={combineTypography(theme.typography.p, styles.timeLabel)}>
            Sleep at
          </Text>
          <View style={styles.timeValueContainer}>
            <Text style={combineTypography(theme.typography.timeValue, styles.timeValue)}>
              {group?.sleep_time ? formatTime(new Date(group.sleep_time)) : '--:--'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.rankingsContainer}>
        <Text style={combineTypography(theme.typography.h2, styles.rankingsTitle)}>
          Rankings
        </Text>
        {group?.members.map((member, index) => (
          <View key={member} style={[
            styles.rankingRow,
            index === 1 && styles.selectedRank
          ]}>
            <Text style={styles.rankNumber}>{index + 1}</Text>
            <View style={styles.rankAvatar}>
              <Text>🐻</Text>
            </View>
            <Text style={combineTypography(theme.typography.p, styles.rankName)}>
              {member}
            </Text>
            <Text style={combineTypography(theme.typography.p, styles.rankScore)}>
              597
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {group ? renderAlarmState() : renderNoAlarmState()}
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
    padding: 16,
    marginBottom: 24,
    width: '100%',
  },
  timeBlock: {
    alignItems: 'flex-start',
    minWidth: '40%',
  },
  timeLabel: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  timeValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  timeValue: {
    color: theme.colors.text.primary,
  },
  timePeriod: {
    color: theme.colors.text.primary,
    marginBottom: 0,
  },
  rankingsContainer: {
    backgroundColor: theme.colors.background.menu,
    borderRadius: 16,
    padding: 16,
    paddingHorizontal: 24,
    flex: 1,
    marginBottom: 16,
  },
  rankingsTitle: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  rankingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  selectedRank: {
    backgroundColor: theme.colors.background.selected,
  },
  rankNumber: {
    width: 24,
    textAlign: 'center',
    color: theme.colors.text.primary,
    fontSize: 16,
  },
  rankAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.avatar,
    marginHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankName: {
    flex: 1,
    color: theme.colors.text.primary,
    fontSize: 16,
  },
  rankScore: {
    color: theme.colors.text.primary,
    marginLeft: 8,
    fontSize: 16,
  },
  bearImage: {
    width: "100%", // Will take up 80% of the parent container width
    height: undefined, // Let height adjust automatically
    aspectRatio: 1, // Maintain 1:1 aspect ratio
    // marginVertical: theme.spacing.xl,
  },
});
