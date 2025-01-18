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

export default function Profile() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarEmoji}>🐻</Text>
          </View>
          <Text style={styles.profileName}>Franklin</Text>
          <Text style={styles.profileSubtext}>Sleeping since 2024</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8h 12m</Text>
            <Text style={styles.statLabel}>Avg Sleep</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>92%</Text>
            <Text style={styles.statLabel}>Consistency</Text>
          </View>
        </View>

        {/* Friends List */}
        <View style={styles.friendsSection}>
          <Text style={styles.sectionTitle}>Friends</Text>
          <View style={styles.friendsContainer}>
            {/* Friend Item */}
            <TouchableOpacity style={styles.friendItem}>
              <View style={styles.friendAvatar}>
                <Text>🐻</Text>
              </View>
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>Mike</Text>
                <Text style={styles.friendStreak}>3 day streak</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="gray" />
            </TouchableOpacity>
            {/* Add more friends similarly */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a", // bg-slate-900
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    padding: 16, // p-4
    alignItems: "center",
  },
  avatarContainer: {
    width: 96, // w-24
    height: 96, // h-24
    backgroundColor: "#1e293b", // bg-slate-800
    borderRadius: 48, // rounded-full (half of width/height)
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16, // mb-4
  },
  avatarEmoji: {
    fontSize: 36, // text-4xl
  },
  profileName: {
    color: "white",
    fontSize: 20, // text-xl
    fontWeight: "bold",
  },
  profileSubtext: {
    color: "#9ca3af", // text-gray-400
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16, // p-4
    backgroundColor: "#1e293b", // bg-slate-800
    marginHorizontal: 16, // mx-4
    borderRadius: 12, // rounded-xl
    marginBottom: 16, // mb-4
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    color: "white",
    fontSize: 20, // text-xl
    fontWeight: "bold",
  },
  statLabel: {
    color: "#9ca3af", // text-gray-400
  },
  friendsSection: {
    padding: 16, // p-4
  },
  sectionTitle: {
    color: "white",
    fontSize: 18, // text-lg
    fontWeight: "bold",
    marginBottom: 8, // mb-2
  },
  friendsContainer: {
    backgroundColor: "#1e293b", // bg-slate-800
    borderRadius: 12, // rounded-xl
  },
  friendItem: {
    padding: 16, // p-4
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#334155", // border-slate-700
  },
  friendAvatar: {
    width: 40, // w-10
    height: 40, // h-10
    backgroundColor: "#3b82f6", // bg-blue-500
    borderRadius: 20, // rounded-full
    alignItems: "center",
    justifyContent: "center",
  },
  friendInfo: {
    marginLeft: 12, // ml-3
    flex: 1,
  },
  friendName: {
    color: "white",
  },
  friendStreak: {
    color: "#9ca3af", // text-gray-400
  },
});
