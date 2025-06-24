import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { supabase } from "../supabase";
import { useAuth } from "../contexts/AuthContext";

export default function LoginScreen() {
  const { loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // or "signup"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAuth() {
    setLoading(true);
    setError("");
    let result;
    if (mode === "login") {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
    }
    if (result.error) {
      setError(result.error.message);
    } else if (mode === "signup") {
      setError("Check your email to confirm your account.");
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flinch</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        autoCapitalize="none"
        secureTextEntry
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={styles.button}
        onPress={handleAuth}
        disabled={loading || authLoading}
      >
        {loading || authLoading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>{mode === "login" ? "Log In" : "Sign Up"}</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setMode(mode === "login" ? "signup" : "login")}>
        <Text style={styles.switchText}>
          {mode === "login" ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF8F3", padding: 20 },
  title: { fontSize: 40, color: "#FFB347", fontWeight: "bold", marginBottom: 32 },
  input: { width: "100%", backgroundColor: "#fff", padding: 14, marginBottom: 16, borderRadius: 8, borderWidth: 1, borderColor: "#FFD699", fontSize: 18 },
  button: { backgroundColor: "#FFB347", paddingVertical: 14, paddingHorizontal: 40, borderRadius: 8, width: "100%", alignItems: "center", marginBottom: 8 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  switchText: { marginTop: 12, color: "#FFB347", fontSize: 16 },
  error: { color: "red", marginBottom: 12, textAlign: "center" },
});