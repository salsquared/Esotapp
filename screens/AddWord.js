import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

export default function AddWord({ navigation }) {
    const [word, setWord] = useState('');
    const [definition, setDefinition] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Debounce effect to fetch definition
    useEffect(() => {
        const fetchDefinition = async () => {
            const trimmedWord = word.trim();
            if (trimmedWord.length < 2) return;

            setIsLoading(true);
            try {
                const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${trimmedWord}`);
                const data = await response.json();

                if (Array.isArray(data) && data.length > 0) {
                    const firstDef = data[0].meanings[0]?.definitions[0]?.definition;
                    if (firstDef) {
                        setDefinition(firstDef);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                }
            } catch (error) {
                // Silent fail - user can still type manually
                console.log("Error fetching definition:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            if (word) fetchDefinition();
        }, 1000); // 1 second debounce

        return () => clearTimeout(timeoutId);
    }, [word]);

    const saveWord = async () => {
        if (!word.trim() || !definition.trim()) {
            Alert.alert('Error', 'Please enter both a word and a definition.');
            return;
        }

        try {
            const newEntry = {
                id: Date.now().toString(),
                word: word.trim(),
                definition: definition.trim(),
                dateAdded: new Date().toISOString(),
            };

            const existingData = await AsyncStorage.getItem('vocabList');
            const words = existingData ? JSON.parse(existingData) : [];

            const updatedWords = [newEntry, ...words];
            await AsyncStorage.setItem('vocabList', JSON.stringify(updatedWords));

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Success', 'Word added to your list!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);

            setWord('');
            setDefinition('');

        } catch (e) {
            Alert.alert('Error', 'Failed to save word.');
            console.error(e);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-gray-900"
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }} keyboardShouldPersistTaps="handled">
                <Text className="text-white text-lg font-bold mb-2">Word</Text>
                <View className="relative">
                    <TextInput
                        className="bg-gray-800 text-white p-4 rounded-xl mb-6 text-lg border border-gray-700 focus:border-blue-500"
                        placeholder="e.g. Ephemeral"
                        placeholderTextColor="#6b7280"
                        value={word}
                        onChangeText={setWord}
                    />
                    {isLoading && (
                        <View className="absolute right-4 top-4">
                            <ActivityIndicator size="small" color="#3b82f6" />
                        </View>
                    )}
                </View>

                <View className="flex-row justify-between mb-2">
                    <Text className="text-white text-lg font-bold">Definition</Text>
                    {isLoading && <Text className="text-blue-400 text-sm italic">Searching...</Text>}
                </View>

                <TextInput
                    className="bg-gray-800 text-white p-4 rounded-xl mb-8 text-lg border border-gray-700 h-32 focus:border-blue-500"
                    placeholder="Type logic manually or wait for auto-fetch..."
                    placeholderTextColor="#6b7280"
                    multiline
                    textAlignVertical="top"
                    value={definition}
                    onChangeText={setDefinition}
                />

            </TouchableOpacity>
        </ScrollView>
        </KeyboardAvoidingView >
    );
}
