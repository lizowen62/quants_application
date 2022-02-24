import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function CryptoItem({ item, callback }) {
  return (
    <TouchableOpacity onPress={() => callback(item.name)}>
      <Text style={styles.item}>
        <Text>{item.name}</Text>
        <Text> hyjhfgb </Text>
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 16,
    justifyContent: "space-around",
    marginTop: 16,
    display: "flex",
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 2,
  },
});
