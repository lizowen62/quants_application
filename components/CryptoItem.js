import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

export default function CryptoItem({ item, symbol, callback }) {
  return (
    <TouchableOpacity onPress={() => callback(item)}>
      <View style={symbol == item.symbol ? styles.select : styles.item}>
        <Text>{item.name}</Text>
        <Text> avg {item.quote.USD.price.toFixed(2)} $ </Text>
        <Text style={styles.tag}>{item.symbol}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 16,
    marginTop: 16,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 2,
  },
  select: {
    padding: 16,
    marginTop: 16,
    flex: 1,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: "#F8FEE8",
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "#EDFCC4",
    borderWidth: 1,
    borderRadius: 2,
  },
  tag: {
    padding: 4,
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 2,
  },
});
