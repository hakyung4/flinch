import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ActivityIndicator, View } from "react-native";

// Import screens
import LoginScreen from "./screens/LoginScreen";
import SetHandleScreen from "./screens/SetHandleScreen";
import MainTabs from "./screens/MainTabs";

// Helper function to check if profile needs handle setup
function needsHandle(profile) {
  // Adjust this logic to your real profile structure!
  return !profile || !profile.handle || profile.handle.trim() === "";
}

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, profile, loading, profileLoading } = useAuth();

  // Show loading spinner while auth/profile is loading
  if (loading || profileLoading || profile === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF8F3" }}>
        <ActivityIndicator size="large" color="#FFB347" />
      </View>
    );
  }

  // Not logged in: show login
  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    );
  }

  // Logged in but needs handle: show onboarding handle screen
  if (needsHandle(profile)) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SetHandle" component={SetHandleScreen} />
      </Stack.Navigator>
    );
  }

  // Logged in and has handle: show main app
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}