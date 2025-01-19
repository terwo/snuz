import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { theme } from '../styles/theme';
import { combineTypography } from '../styles/typography';
import Button from '../components/Button';
import Input from '../components/Input';
import Checkbox from '../components/Checkbox';
import UserRow from '../components/UserRow';
import { useGroup } from '../context/group';
import { useAuth } from '../context/auth';

// Temporary mock data
const mockUsers = [
  { id: 1, name: 'Jason', username: 'jason1', avatar: require('../../assets/images/avatar.png') },
  { id: 2, name: 'Jason', username: 'jason2', avatar: require('../../assets/images/avatar.png') },
  { id: 3, name: 'Jason', username: 'jason3', avatar: require('../../assets/images/avatar.png') },
  { id: 4, name: 'Jason', username: 'jason4', avatar: require('../../assets/images/avatar.png') },
  { id: 5, name: 'Jason', username: 'jason5', avatar: require('../../assets/images/avatar.png') },
  { id: 6, name: 'Jason', username: 'jason6', avatar: require('../../assets/images/avatar.png') },
];

export default function NewPlan() {
  const { createGroup } = useGroup();
  const { username } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [currentStep, setCurrentStep] = useState<'time' | 'people'>('time');
  const [wakeUpTime, setWakeUpTime] = useState(new Date());
  const [sleepTime, setSleepTime] = useState(new Date());
  const [showWakeUpPicker, setShowWakeUpPicker] = useState(false);
  const [showSleepPicker, setShowSleepPicker] = useState(false);
  const [snoozeGoal, setSnoozeGoal] = useState('0');
  const [planDuration, setPlanDuration] = useState('7');
  const [sendReminder, setSendReminder] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const handleCreatePlan = async () => {
    if (!username) {
      setError('Not logged in');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      // Get all selected usernames (including current user)
      const selectedMembers = [
        username, // Current user
        ...mockUsers
          .filter(user => selectedUsers.includes(user.id))
          .map(user => user.username)
      ];

      // Convert local times to UTC strings
      const wakeTimeUTC = new Date(wakeUpTime).toISOString();
      const sleepTimeUTC = new Date(sleepTime).toISOString();

      await createGroup({
        owner_username: username,
        start_date: new Date().toISOString(),
        members: selectedMembers,
        wake_time: wakeTimeUTC,
        sleep_time: sleepTimeUTC,
        days_left: parseInt(planDuration, 10)
      });

      router.back();
    } catch (error) {
      console.error('Failed to create group:', error);
      setError(error instanceof Error ? error.message : 'Failed to create group');
    } finally {
      setIsCreating(false);
    }
  };

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const renderTimeSetup = () => (
    <>
      <Text style={combineTypography(theme.typography.title, styles.title)}>
        Sleep Plan
      </Text>
      <Text style={[combineTypography(theme.typography.p)[0], styles.subtitle]}>
        Set up the your new sleep schedule
      </Text>

      <Input
        type="time"
        label="Wake up time"
        value={wakeUpTime}
        onChange={setWakeUpTime}
        showPicker={showWakeUpPicker}
        onPress={() => setShowWakeUpPicker(true)}
        onPickerDismiss={() => setShowWakeUpPicker(false)}
      />

      <Input
        type="number"
        label="Snooze goal"
        value={snoozeGoal}
        onChangeText={setSnoozeGoal}
        suffix="times or less"
      />

      <Input
        type="time"
        label="Sleep time"
        value={sleepTime}
        onChange={setSleepTime}
        showPicker={showSleepPicker}
        onPress={() => setShowSleepPicker(true)}
        onPickerDismiss={() => setShowSleepPicker(false)}
      />

      <Checkbox
        checked={sendReminder}
        onPress={() => setSendReminder(!sendReminder)}
        label="Send me a reminder 30 mins before time"
        style={styles.reminderRow}
      />

      <Input
        type="number"
        label="Plan duration"
        value={planDuration}
        onChangeText={setPlanDuration}
        suffix="Days"
      />
    </>
  );

  const renderPeopleSelection = () => (
    <>
      <Text style={combineTypography(theme.typography.title, styles.title)}>
        New Plan
      </Text>
      <Text style={[combineTypography(theme.typography.p)[0], styles.subtitle]}>
        Add at least 1 friend to do this plan together
      </Text>

      <Text style={styles.sectionTitle}>Add people</Text>
      
      <ScrollView style={styles.userList}>
        {mockUsers.map(user => (
          <UserRow
            key={user.id}
            user={user}
            selected={selectedUsers.includes(user.id)}
            onPress={() => toggleUserSelection(user.id)}
          />
        ))}
      </ScrollView>
    </>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {currentStep === 'time' ? renderTimeSetup() : renderPeopleSelection()}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          variant="secondary"
          title={currentStep === 'people' ? 'Back' : 'Cancel'}
          onPress={() => {
            if (currentStep === 'people') {
              setCurrentStep('time');
            } else {
              router.back();
            }
          }}
          style={{ marginRight: 8 }}
          disabled={isCreating}
        />
        <Button
          variant="primary"
          title={isCreating 
            ? 'Creating...' 
            : currentStep === 'people' 
              ? 'Create Plan' 
              : 'Next'
          }
          onPress={() => {
            if (currentStep === 'time') {
              setCurrentStep('people');
            } else {
              handleCreatePlan();
            }
          }}
          style={{ marginLeft: 8 }}
          disabled={isCreating}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.main,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    color: theme.colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: theme.colors.text.primary,
    marginBottom: 32,
    textAlign: 'center',
  },
  sectionTitle: {
    ...combineTypography(theme.typography.h2)[0],
    color: theme.colors.text.primary,
    marginBottom: 16,
  },
  reminderRow: {
    marginBottom: 24,
  },
  userList: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
});
