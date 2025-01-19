import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Image } from 'react-native';
import { router } from 'expo-router';
import { theme } from '../styles/theme';
import { combineTypography } from '../styles/typography';
import Button from '../components/Button';
import Input from '../components/Input';
import Checkbox from '../components/Checkbox';
import UserRow from '../components/UserRow';
import { useGroup } from '../context/group';
import { useAuth } from '../context/auth';
import { useUser } from '../context/user';

export default function NewPlan() {
  const { createGroup } = useGroup();
  const { username } = useAuth();
  const { users, getAllUsers } = useUser();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentStep, setCurrentStep] = useState<'time' | 'people'>('time');
  const [wakeUpTime, setWakeUpTime] = useState(new Date());
  const [sleepTime, setSleepTime] = useState(new Date());
  const [showWakeUpPicker, setShowWakeUpPicker] = useState(false);
  const [showSleepPicker, setShowSleepPicker] = useState(false);
  const [planDuration, setPlanDuration] = useState('7');
  const [sendReminder, setSendReminder] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Fetch all users when component mounts
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await getAllUsers();
      } catch (error) {
        setError('Failed to load users. Please try again.');
        console.error('Error loading users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []); // Only run on mount

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
        ...selectedUsers
      ];

      // Get today's date
      const today = new Date();
      
      // Set up sleep time for today
      const sleepDate = new Date(sleepTime);
      sleepDate.setFullYear(today.getFullYear());
      sleepDate.setMonth(today.getMonth());
      sleepDate.setDate(today.getDate());
      
      // If sleep time is before current time, set it to tomorrow
      if (sleepDate < today) {
        sleepDate.setDate(sleepDate.getDate() + 1);
      }
      
      // Set up wake time based on sleep time
      const wakeDate = new Date(wakeUpTime);
      wakeDate.setFullYear(sleepDate.getFullYear());
      wakeDate.setMonth(sleepDate.getMonth());
      wakeDate.setDate(sleepDate.getDate());
      
      // If wake time is before sleep time, it means wake up is next day
      if (wakeDate < sleepDate) {
        wakeDate.setDate(wakeDate.getDate() + 1);
      }

      await createGroup({
        owner_username: username,
        members: selectedMembers,
        sleep_time: sleepDate.toISOString(),
        wake_time: wakeDate.toISOString(),
        start_date: sleepDate.toISOString(), // Use sleep time as start date
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

  const toggleUserSelection = (selectedUsername: string) => {
    setSelectedUsers(prev => 
      prev.includes(selectedUsername)
        ? prev.filter(u => u !== selectedUsername)
        : [...prev, selectedUsername]
    );
  };

  const renderTimeSetup = () => (
    <>
      <Text style={combineTypography(theme.typography.title, styles.title)}>
        Sleep Plan
      </Text>
      <Text style={[combineTypography(theme.typography.p)[0], styles.subtitle]}>
        Set up your new sleep schedule
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

  const renderPeopleSetup = () => (
    <>
      <Text style={combineTypography(theme.typography.title, styles.title)}>
        Add People
      </Text>
      <Text style={[combineTypography(theme.typography.p)[0], styles.subtitle]}>
        Select people to join your sleep plan
      </Text>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading users...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            title="Retry" 
            onPress={() => getAllUsers()} 
            variant="secondary"
          />
        </View>
      ) : users.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text>No users available to add</Text>
        </View>
      ) : (
        <ScrollView style={styles.userList}>
          {users
            .filter(user => user.username !== username) // Filter out current user
            .map((user, index) => (
              <UserRow
                key={user.username}
                user={{
                  id: index + 1,
                  name: user.username,
                  avatar: require('../../assets/images/avatar.png')
                }}
                selected={selectedUsers.includes(user.username)}
                onPress={() => toggleUserSelection(user.username)}
              />
            ))}
        </ScrollView>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {currentStep === 'time' ? renderTimeSetup() : renderPeopleSetup()}
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
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorText: {
    color: theme.colors.text.primary,
    marginBottom: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
});