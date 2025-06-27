import React, { createContext, useState, useEffect } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  getProfile as apiGetProfile,
  updateProfile as apiUpdateProfile,
} from "../api/auth";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("swiftcart_token");
      if (token) {
        try {
          const { user: profileUser } = await apiGetProfile();
          setUser(profileUser);
        } catch (error) {
          console.error("Failed to load user profile from token:", error);
          localStorage.removeItem("swiftcart_token"); // Clear invalid token
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (credentials) => {
    try {
      const { token, user: loggedInUser } = await apiLogin(credentials);
      localStorage.setItem("swiftcart_token", token);
      setUser(loggedInUser);
      return { success: true, user: loggedInUser };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const { token, user: registeredUser } = await apiRegister(userData);
      localStorage.setItem("swiftcart_token", token);
      setUser(registeredUser);
      return { success: true, user: registeredUser };
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("swiftcart_token");
  };

  const updateUserProfile = async (newProfileData) => {
    try {
      const { user: updatedUser } = await apiUpdateProfile(newProfileData);
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};
