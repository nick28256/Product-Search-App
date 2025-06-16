import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Linking, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenContainer } from '../../components/ScreenContainer';


type HistoryItem = {
    type: 'search' | 'click';
    value: string;
    timestamp: number;
    url?: string;
};

const HISTORY_KEY = 'user_history';

const About = () => {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        const loadHistory = async () => {
            const data = await AsyncStorage.getItem(HISTORY_KEY);
            if (data) setHistory(JSON.parse(data));
        };
        loadHistory();
    }, []);

    const clearHistory = async () => {
        Alert.alert(
            "Clear History",
            "Are you sure you want to clear your history?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Clear",
                    style: "destructive",
                    onPress: async () => {
                        await AsyncStorage.removeItem(HISTORY_KEY);
                        setHistory([]);
                    }
                }
            ]
        );
    };

    return (

        <ScreenContainer>
            <View style={styles.container}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>🕓 Your Activity</Text>
                    <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
                        <Text style={styles.clearButtonText}>Clear History</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={history.sort((a, b) => b.timestamp - a.timestamp)}
                    keyExtractor={(_, idx) => idx.toString()}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No history yet. Start searching and clicking on products!</Text>
                    }
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={styles.itemType}>
                                {item.type === 'search' ? '🔍 Searched:' : '🛒 Viewed:'}
                            </Text>
                            {item.type === 'search' ? (
                                <Text style={styles.itemValue}>{item.value}</Text>
                            ) : (
                                <TouchableOpacity onPress={() => item.url && Linking.openURL(item.url)}>
                                    <Text style={[styles.itemValue, styles.link]} numberOfLines={1}>
                                        {item.value}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            <Text style={styles.timestamp}>
                                {new Date(item.timestamp).toLocaleString()}
                            </Text>
                        </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 30 }}
                />
            </View>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eaffd0',
        padding: 20,
        marginTop: 45,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a2e1a',
        letterSpacing: 1,
    },
    clearButton: {
        backgroundColor: '#fff',
        borderColor: '#1a2e1a',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 14,
    },
    clearButtonText: {
        color: '#1a2e1a',
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyText: {
        color: '#1a2e1a',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 40,
    },
    item: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,
        shadowColor: '#b9ffb7',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    itemType: {
        color: '#1a2e1a',
        fontWeight: 'bold',
        marginBottom: 2,
    },
    itemValue: {
        color: '#2e4d2c',
        fontSize: 16,
        marginBottom: 2,
    },
    link: {
        textDecorationLine: 'underline',
        color: '#1a2e1a',
    },
    timestamp: {
        color: '#888',
        fontSize: 12,
        marginTop: 2,
    },
});

export default About;