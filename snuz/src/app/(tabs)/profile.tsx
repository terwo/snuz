// app/profile.tsx
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { combineTypography } from "../../styles/typography";

export default function Profile() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarEmoji}>🐻</Text>
          </View>
          <Text
            style={combineTypography(theme.typography.h1, styles.profileName)}
          >
            Franklin
          </Text>
          <Text
            style={combineTypography(theme.typography.p, styles.profileSubtext)}
          >
            Sleeping since 2024
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text
              style={combineTypography(theme.typography.h1, styles.statNumber)}
            >
              5
            </Text>
            <Text
              style={combineTypography(theme.typography.p, styles.statLabel)}
            >
              Day Streak
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text
              style={combineTypography(theme.typography.h1, styles.statNumber)}
            >
              8h 12m
            </Text>
            <Text
              style={combineTypography(theme.typography.p, styles.statLabel)}
            >
              Avg Sleep
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text
              style={combineTypography(theme.typography.h1, styles.statNumber)}
            >
              92%
            </Text>
            <Text
              style={combineTypography(theme.typography.p, styles.statLabel)}
            >
              Consistency
            </Text>
          </View>
        </View>

        {/* Friends List */}
        <View style={styles.friendsSection}>
          <Text
            style={combineTypography(theme.typography.h2, styles.sectionTitle)}
          >
            Fellow Snoozers
          </Text>
          <View style={styles.friendsContainer}>
            {/* Friend Item */}
            <TouchableOpacity style={styles.friendItem}>
              <View style={styles.friendAvatar}>
                <Text>🐻</Text>
              </View>
              <View style={styles.friendInfo}>
                <Text
                  style={combineTypography(
                    theme.typography.h3,
                    styles.friendName
                  )}
                >
                  Mike
                </Text>
                <Text
                  style={combineTypography(
                    theme.typography.p,
                    styles.friendStatus
                  )}
                >
                  Sleeping 😴
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={theme.colors.text.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.main,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    backgroundColor: theme.colors.background.menu,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
  },
  avatarEmoji: {
    fontSize: 48,
  },
  profileName: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  profileSubtext: {
    color: theme.colors.text.primary,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.menu,
    marginHorizontal: theme.spacing.md,
    borderRadius: 16,
    marginBottom: theme.spacing.xl,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    color: theme.colors.text.primary,
  },
  friendsSection: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  friendsContainer: {
    backgroundColor: theme.colors.background.menu,
    borderRadius: 16,
    overflow: "hidden",
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background.main,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.accent,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.sm,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  friendStatus: {
    color: theme.colors.text.primary,
  },
});
