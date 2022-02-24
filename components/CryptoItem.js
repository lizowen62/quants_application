import React from "react";
import { StyleSheet, View,  Text, TouchableOpacity } from "react-native";

export default function CryptoItem({ item, callback }) {
  return (
    <TouchableOpacity onPress={() => callback(item.name)}>
      <View style={styles.item}>
        <Text>{item.name}</Text>
        <Text style={styles.tag}>{item.symbol}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 16,
    marginTop: 16,
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 2,
  },
  tag: {
      padding: 4,
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 2,
  }
});
