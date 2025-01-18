// app/profile.tsx
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <ScrollView className="flex-1">
        {/* Profile Header */}
        <View className="p-4 items-center">
          <View className="w-24 h-24 bg-slate-800 rounded-full items-center justify-center mb-4">
            <Text className="text-4xl">🐻</Text>
          </View>
          <Text className="text-white text-xl font-bold">Franklin</Text>
          <Text className="text-gray-400">Sleeping since 2024</Text>
        </View>

        {/* Stats */}
        <View className="flex-row justify-around p-4 bg-slate-800 mx-4 rounded-xl mb-4">
          <View className="items-center">
            <Text className="text-white text-xl font-bold">5</Text>
            <Text className="text-gray-400">Day Streak</Text>
          </View>
          <View className="items-center">
            <Text className="text-white text-xl font-bold">8h 12m</Text>
            <Text className="text-gray-400">Avg Sleep</Text>
          </View>
          <View className="items-center">
            <Text className="text-white text-xl font-bold">92%</Text>
            <Text className="text-gray-400">Consistency</Text>
          </View>
        </View>

        {/* Friends List */}
        <View className="p-4">
          <Text className="text-white text-lg font-bold mb-2">Friends</Text>
          <View className="bg-slate-800 rounded-xl">
            {/* Friend Item */}
            <TouchableOpacity className="p-4 flex-row items-center border-b border-slate-700">
              <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center">
                <Text>🐻</Text>
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-white">Mike</Text>
                <Text className="text-gray-400">3 day streak</Text>
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
