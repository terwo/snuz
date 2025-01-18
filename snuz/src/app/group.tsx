// app/group.tsx
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function Group() {
  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="p-4">
        {/* Current Group Alarm */}
        <View className="bg-slate-800 rounded-xl p-4 mb-4">
          <Text className="text-white text-lg font-bold mb-2">
            Squad Alarm 🚨
          </Text>
          <Text className="text-3xl text-white font-bold mb-1">7:30 AM</Text>
          <Text className="text-gray-400">Tomorrow • 3 squad members</Text>
        </View>

        {/* Set New Alarm Button */}
        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-xl flex-row items-center justify-center mb-4"
          onPress={() => {
            /* TODO: Open alarm setter */
          }}
        >
          <Ionicons name="alarm-outline" size={24} color="white" />
          <Text className="text-white font-bold ml-2">Set Squad Alarm</Text>
        </TouchableOpacity>

        {/* Squad Members */}
        <Text className="text-white text-lg font-bold mb-2">Squad Members</Text>
        <View className="bg-slate-800 rounded-xl p-4">
          <View className="flex-row items-center mb-2">
            <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center">
              <Text>🐻</Text>
            </View>
            <View className="ml-3">
              <Text className="text-white">Sarah</Text>
              <Text className="text-gray-400">Ready for bed 😴</Text>
            </View>
          </View>
          {/* Add more squad members similarly */}
        </View>
      </View>
    </SafeAreaView>
  );
}
