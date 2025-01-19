// utils/notificationConfig.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Set up notifications handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  return finalStatus === 'granted';
}

export async function scheduleAlarm(selectedDate) {
    // Request permissions
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Need notification permissions to set alarms!');
      return false;
    }
  
    // Cancel any existing alarms
    await Notifications.cancelAllScheduledNotificationsAsync();
  
    // Schedule the new alarm
    const trigger = new Date(selectedDate);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'SNUZ IS SLEEPY! 🐻',
        body: 'Get to bed before your fellow bears!',
        sound: true,
      },
      trigger: null, // send immediately for now
      // trigger,
    });
  
    return true;
  }

  export const testNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Test Notification 🐻',
        body: 'Your notification system is working!',
        sound: true,
      },
      trigger: null,  // null means send immediately
    });
  };