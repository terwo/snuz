// app/index.tsx
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="flex-1 items-center justify-center p-4">
        {/* Bear display will go here */}
        <View className="w-64 h-64 bg-slate-800 rounded-full mb-8 items-center justify-center">
          <Text className="text-4xl">🐻</Text>
        </View>

        <View className="w-full max-w-sm">
          <Text className="text-2xl font-bold text-white mb-2 text-center">
            Good Evening! 🌙
          </Text>
          <Text className="text-lg text-gray-300 text-center">
            Your bear is getting sleepy...
          </Text>
          <Text className="text-sm text-gray-400 text-center mt-2">
            Sleep consistency streak: 5 days 🔥
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
