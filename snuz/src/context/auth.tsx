import React, { createContext, useContext, useState } from "react";

// Define the shape of our context
type AuthContextType = {
  username: string | null;
  login: (username: string) => Promise<void>;
  logout: () => void;
};

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// API functions
const API_ROOT = "https://alvicorn-fastapi.prod1.defang.dev";

async function loginUser(username: string) {
  const formData = new FormData();
  formData.append("username", username);

  const response = await fetch(`${API_ROOT}/login`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
}

async function createUser(username: string) {
  const formData = new FormData();
  formData.append("username", username);

  const response = await fetch(`${API_ROOT}/create-user`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("User creation failed");
  }

  return response.json();
}

// Create the provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);

  const login = async (newUsername: string) => {
    try {
      // Try to login first
      const loginResponse = await loginUser(newUsername);
      console.log("Login response:", loginResponse);
    } catch (error) {
      // If login fails, try to create user
      const createResponse = await createUser(newUsername);
      console.log("Create user response:", createResponse);
      // Then login again
      const retryLoginResponse = await loginUser(newUsername);
      console.log("Retry login response:", retryLoginResponse);
    }

    setUsername(newUsername);
  };

  const logout = () => {
    setUsername(null);
  };

  const value = {
    username,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
