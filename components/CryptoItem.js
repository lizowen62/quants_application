import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function CryptoItem({item}) {

    return (
        <TouchableOpacity>
            <Text style={styles.item}>{item.title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    item: {
        padding: 16,
        marginTop: 16,
        borderColor: '#bbb',
        borderWidth: 1,

    }
})