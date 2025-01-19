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
  getGroup: (username: string) => Promise<void>;
}

// Create the context
const GroupContext = createContext<GroupContextType | null>(null);

// API functions
const API_ROOT = "https://alvicorn-fastapi.prod1.defang.dev";

async function createNewGroup(data: Omit<GroupData, "id">) {
  try {
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
        start_date: data.start_date,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to create group");
    }

    return response.json();
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
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

// New function to fetch group info
async function fetchGroupInfo(username: string) {
  const formData = new FormData();
  formData.append('username', username);

  const response = await fetch(`${API_ROOT}/my-group`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch group info");
  }

  const data = await response.json();
  
  // If user is not in a group, return null
  if (!data.in_group) {
    return null;
  }

  // Transform the backend response to match our GroupData interface
  return {
    id: data.group_id,
    owner_username: data.owner_username,
    members: data.group_members,
    wake_time: data.to_wake_up_time,
    sleep_time: data.to_sleep_time,
    days_left: data.days_remaining,
    start_date: data.start_date,
  };
}

// Create the provider component
export function GroupProvider({ children }: { children: React.ReactNode }) {
  const [group, setGroup] = useState<GroupData | null>(null);

  const createGroup = async (data: Omit<GroupData, "id">) => {
    try {
      // Ensure all dates are in UTC ISO format
      const utcData = {
        ...data,
        wake_time: new Date(data.wake_time).toISOString(),
        sleep_time: new Date(data.sleep_time).toISOString(),
        start_date: new Date(data.start_date || Date.now()).toISOString(),
      };

      // Validate the data
      if (utcData.days_left < 1) {
        throw new Error("Duration must be at least 1 day");
      }

      if (new Date(utcData.start_date) < new Date()) {
        throw new Error("Start date must be in the future");
      }

      if (new Date(utcData.sleep_time) < new Date()) {
        throw new Error("Cannot schedule a sleeping time in the past");
      }

      // Ensure owner is in the members list
      if (!utcData.members.includes(utcData.owner_username)) {
        utcData.members.push(utcData.owner_username);
      }

      const response = await createNewGroup(utcData);
      setGroup(response);
    } catch (error) {
      console.error("Error creating group:", error);
      throw error;
    }
  };

  const updateGroup = async (data: Partial<GroupData>) => {
    if (!group?.id) {
      throw new Error("No active group to update");
    }
    const response = await updateExistingGroup(group.id, data);
    setGroup(response);
  };

  const leaveGroup = async () => {
    if (!group?.id) {
      throw new Error("No active group to leave");
    }
    await leaveExistingGroup(group.id);
    setGroup(null);
  };

  const clearGroup = () => {
    setGroup(null);
  };

  const getGroup = async (username: string) => {
    try {
      const response = await fetchGroupInfo(username);
      setGroup(response);
    } catch (error) {
      console.error("Error fetching group:", error);
      setGroup(null);
      throw error;
    }
  };

  const value = {
    group,
    createGroup,
    updateGroup,
    leaveGroup,
    clearGroup,
    getGroup,
  };

  return (
    <GroupContext.Provider value={value}>
      {children}
    </GroupContext.Provider>
  );
}

// Custom hook to use the group context
export function useGroup() {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error("useGroup must be used within a GroupProvider");
  }
  return context;
}
