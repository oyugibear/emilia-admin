import axios, { AxiosError } from "axios";
import { API_URL } from "../config/api.config";
import Cookies from "js-cookie";
import { message } from "antd";

// Define types for better TypeScript support
interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  [key: string]: any; // for additional user properties
}

interface LoginResponse {
  user: User;
  token?: string;
  [key: string]: any; // for additional response properties
}

interface ApiError {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
  };
}

// Export types
export type { User, LoginResponse, LoginCredentials, ApiError };

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse | { error: unknown }> => {
  const saveUserToLocalStorage = (user: User): void => {
    localStorage.setItem("user", JSON.stringify(user));
  };

  try {
    const { data } = await axios.post<LoginResponse>(`${API_URL}/auth/login`, credentials);

    if (data) {
      const user = data?.user;
      console.log("user: ", user);

      // saveUserToLocalStorage(user)
      // Cookies.set("user", JSON.stringify(user), { expires: 7 }) // Cookie expires in 7 days
      message.success("Login Successful");
      return data;
    } else {
      // Handle unexpected response format
      console.error("Unexpected response format:", data);
      message.error("Unexpected response format");
      return { error: "Unexpected response format" };
    }
  } catch (error) {
    const apiError = error as AxiosError<{ error?: string; message?: string }>;
    const errorMessage = apiError.response?.data?.error || apiError.response?.data?.message || "Login failed";
    message.error(errorMessage);
    console.log(errorMessage);
    return { error: error };
  }
};

// Register user function
export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
  [key: string]: any;
}): Promise<LoginResponse | { error: unknown }> => {
  try {
    const { data } = await axios.post<LoginResponse>(`${API_URL}/auth/register`, userData);
    
    if (data) {
      message.success("Registration Successful");
      return data;
    } else {
      message.error("Registration failed");
      return { error: "Registration failed" };
    }
  } catch (error) {
    const apiError = error as AxiosError<{ error?: string; message?: string }>;
    const errorMessage = apiError.response?.data?.error || apiError.response?.data?.message || "Registration failed";
    message.error(errorMessage);
    console.log(errorMessage);
    return { error: error };
  }
};

// Logout user function
export const logoutUser = async (): Promise<boolean> => {
  try {
    // Clear local storage
    localStorage.removeItem("user");
    
    // Clear cookies
    Cookies.remove("user");
    
    // Optional: Call logout endpoint if your API has one
    // await axios.post(`${API_URL}/auth/logout`);
    
    message.success("Logout Successful");
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    message.error("Logout failed");
    return false;
  }
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  try {
    if (typeof window !== 'undefined') {
      const userString = localStorage.getItem("user");
      return userString ? JSON.parse(userString) : null;
    }
    return null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};
