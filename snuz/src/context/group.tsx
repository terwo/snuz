import React, { createContext, useContext, useState } from "react";

// Define the types for our group data
interface GroupData {
  id: string;
  owner_username: string;
  members: string[];
  wake_time: string; // UTC time string
  sleep_time: string; // UTC time string
  days_left: number;
  start_date: string;
}

// Define the shape of our context
interface GroupContextType {
  group: GroupData | null;
  createGroup: (data: Omit<GroupData, "id">) => Promise<void>;
  updateGroup: (data: Partial<GroupData>) => Promise<void>;
  leaveGroup: () => Promise<void>;
  clearGroup: () => void;
}

// Create the context
const GroupContext = createContext<GroupContextType | null>(null);

// API functions
const API_ROOT = "https://alvicorn-fastapi.prod1.defang.dev";

async function createNewGroup(data: Omit<GroupData, "id">) {
  const response = await fetch(`${API_ROOT}/create-group`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      owner_username: data.owner_username,
      group_members: data.members,
      to_wake_up_time: data.wake_time,
      to_sleep_time: data.sleep_time,
      duration_days: data.days_left,
      start_date: data.start_date || new Date().toISOString(),
    }),
  });
  console.log(JSON.stringify({
    owner_username: data.owner_username,
    group_members: data.members,
    to_wake_up_time: data.wake_time,
    to_sleep_time: data.sleep_time,
    duration_days: data.days_left,
    start_date: data.start_date || new Date().toISOString(),
  }),);

  if (!response.ok) {
    throw new Error("Failed to create group");
  }

  return response.json();
}

async function updateExistingGroup(id: string, data: Partial<GroupData>) {
  const response = await fetch(`${API_ROOT}/plans/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update group");
  }

  return response.json();
}

async function leaveExistingGroup(id: string) {
  const response = await fetch(`${API_ROOT}/plans/${id}/leave`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to leave group");
  }

  return response.json();
}

// Create the provider component
export function GroupProvider({ children }: { children: React.ReactNode }) {
  const [group, setGroup] = useState<GroupData | null>(null);

  const createGroup = async (data: Omit<GroupData, "id">) => {
    try {
      const response = await createNewGroup(data);
      setGroup({
        id: response.id,
        owner_username: data.owner_username,
        members: data.members,
        wake_time: data.wake_time,
        sleep_time: data.sleep_time,
        days_left: data.days_left,
        start_date: data.start_date || new Date().toISOString(),
      });
    } catch (error) {
      // console.log(data)
      console.error("Error creating group:", error);
      throw error;
    }
  };

  const updateGroup = async (data: Partial<GroupData>) => {
    if (!group) {
      throw new Error("No active group");
    }

    try {
      await updateExistingGroup(group.id, data);
      setGroup(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      console.error("Error updating group:", error);
      throw error;
    }
  };

  const leaveGroup = async () => {
    if (!group) {
      throw new Error("No active group");
    }

    try {
      await leaveExistingGroup(group.id);
      setGroup(null);
    } catch (error) {
      console.error("Error leaving group:", error);
      throw error;
    }
  };

  const clearGroup = () => {
    setGroup(null);
  };

  const value = {
    group,
    createGroup,
    updateGroup,
    leaveGroup,
    clearGroup,
  };

  return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>;
}

// Custom hook to use the group context
export function useGroup() {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error("useGroup must be used within a GroupProvider");
  }
  return context;
}
