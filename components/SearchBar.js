import React from "react";
import { StyleSheet, View,  Text, TextInput, TouchableOpacity } from "react-native";
import { SearchBar } from 'react-native-elements';

export default function CustomSearch({ callback }) {
  return (
    <View >
      <TextInput style={styles.input_container}
        placeholder="Chercher ..."
        onChangeText={(text) => { callback(text) }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input_container: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#bbb",
    padding: 5
  }
})
