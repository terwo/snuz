import React, { createContext, useContext, useState } from "react";
import { ImageSourcePropType } from "react-native";
import { useWebSocket } from './websocket';

// Define the types for our user data to match the backend UserModel
interface UserData {
  username: string;
  owns_a_group: boolean;
  score: number;
  average_minutes_slept: number | null;
  is_asleep: boolean;
  last_sleep_time: string | null;
  last_awake_time: string | null;
  current_snooze_counter: number;
}

// Extended user data that includes UI-specific fields
export interface ExtendedUserData extends UserData {
  id: number;
  name: string;
  avatar: ImageSourcePropType;
}

// Define the shape of our context
interface UserContextType {
  users: ExtendedUserData[];
  getUserData: (username: string) => Promise<UserData>;
  getAllUsers: () => Promise<void>;
  toSleep: (username: string) => Promise<void>;
  toAwake: (username: string) => Promise<void>;
  toSnooze: (username: string) => Promise<void>;
}

// Create the context
const UserContext = createContext<UserContextType | null>(null);

// API functions
const API_ROOT = "https://alvicorn-fastapi.prod1.defang.dev";

async function fetchUserData(username: string): Promise<UserData> {
  const formData = new FormData();
  formData.append('username', username);

  const response = await fetch(`${API_ROOT}/get-user-data`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  return await response.json();
}

async function fetchAllUsers(): Promise<UserData[]> {
  const response = await fetch(`${API_ROOT}/all-user-data`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch all users");
  }

  const data = await response.json();
  
  // Check if data has the expected structure
  if (!Array.isArray(data?.users)) {
    console.error('Unexpected data format:', data);
    throw new Error('Invalid data format received from server');
  }

  // Transform the response to match our UserData interface
  return data.users.map(user => ({
    username: user.username,
    owns_a_group: user.owns_a_group,
    score: user.score,
    average_minutes_slept: user.average_minutes_slept,
    is_asleep: user.is_asleep,
    last_sleep_time: user.last_sleep_time,
    last_awake_time: user.last_awake_time,
    current_snooze_counter: user.current_snooze_counter || 0
  }));
}

async function markUserAsleep(username: string): Promise<void> {
  const formData = new FormData();
  formData.append('username', username);

  const response = await fetch(`${API_ROOT}/to-sleep`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to mark user as asleep");
  }
}

async function markUserAwake(username: string): Promise<void> {
  const formData = new FormData();
  formData.append('username', username);

  const response = await fetch(`${API_ROOT}/to-awake`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to mark user as awake");
  }
}

async function incrementSnooze(username: string): Promise<void> {
  const formData = new FormData();
  formData.append('username', username);

  const response = await fetch(`${API_ROOT}/to-snooze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to increment snooze counter");
  }
}

// Create the provider component
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<ExtendedUserData[]>([]);
  const { sendMessage } = useWebSocket();

  const getUserData = async (username: string) => {
    return await fetchUserData(username);
  };

  const getAllUsers = async () => {
    try {
      const userData = await fetchAllUsers();
      if (!Array.isArray(userData)) {
        console.error('Invalid user data received:', userData);
        throw new Error('Invalid user data format');
      }
      
      // Transform UserData into ExtendedUserData
      const extendedUserData: ExtendedUserData[] = userData.map((user, index) => ({
        ...user,
        id: index + 1,
        name: user.username || 'Unknown User',
        avatar: require('../../assets/images/avatar.png')
      }));
      setUsers(extendedUserData);
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  };

  const toSleep = async (username: string) => {
    try {
      await markUserAsleep(username);
      // Send WebSocket notification
      sendMessage({
        operation: 'sleep_status',
        username,
        data: { is_asleep: true }
      });
      await getAllUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error marking user as asleep:', error);
      throw error;
    }
  };

  const toAwake = async (username: string) => {
    try {
      await markUserAwake(username);
      // Send WebSocket notification
      sendMessage({
        operation: 'sleep_status',
        username,
        data: { is_asleep: false }
      });
      await getAllUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error marking user as awake:', error);
      throw error;
    }
  };

  const toSnooze = async (username: string) => {
    try {
      await incrementSnooze(username);
      await getAllUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error incrementing snooze:', error);
      throw error;
    }
  };

  const value = {
    users,
    getUserData,
    getAllUsers,
    toSleep,
    toAwake,
    toSnooze,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the user context
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}