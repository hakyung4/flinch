import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MainTabs() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Main Tabs (TODO: Implement main navigation)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF8F3" },
  text: { fontSize: 20, color: "#FFB347" },
});