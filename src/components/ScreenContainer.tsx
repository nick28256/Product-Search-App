import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

export const ScreenContainer = ({ children }) => (
    <SafeAreaView style={styles.container}>{children}</SafeAreaView>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eaffd0',
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 90,
    },
});