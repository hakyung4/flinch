import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../supabase";

export default function SetHandleScreen() {
  const { user, profileLoading } = useAuth();
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function submitHandle() {
    setLoading(true);
    setError("");
    setSuccess(false);

    // Simple validation
    if (!handle.match(/^[a-zA-Z0-9_]{3,20}$/)) {
      setError("Handle must be 3-20 letters, numbers, or underscores.");
      setLoading(false);
      return;
    }

    // Check if handle is taken
    const { data: existing, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("handle", handle)
      .single();

    if (existing) {
      setError("Handle is already taken.");
      setLoading(false);
      return;
    }

    // Update profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ handle })
      .eq("id", user.id);

    if (updateError) {
      setError("Failed to set handle. Please try again.");
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your Flinch handle</Text>
      <TextInput
        style={styles.input}
        placeholder="your_handle"
        value={handle}
        autoCapitalize="none"
        onChangeText={setHandle}
        editable={!loading}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>Handle set! You can continue.</Text> : null}
      <TouchableOpacity style={styles.button} onPress={submitHandle} disabled={loading || profileLoading}>
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Set Handle</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF8F3", padding: 20 },
  title: { fontSize: 28, color: "#FFB347", fontWeight: "bold", marginBottom: 24, textAlign: "center" },
  input: { width: "100%", backgroundColor: "#fff", padding: 14, marginBottom: 16, borderRadius: 8, borderWidth: 1, borderColor: "#FFD699", fontSize: 18 },
  button: { backgroundColor: "#FFB347", paddingVertical: 14, paddingHorizontal: 40, borderRadius: 8, width: "100%", alignItems: "center", marginBottom: 8 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  error: { color: "red", marginBottom: 12, textAlign: "center" },
  success: { color: "green", marginBottom: 12, textAlign: "center" },
});