import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

export default function Home({ navigation }) {
    const [wordCount, setWordCount] = useState(0);
    const { colorScheme } = useColorScheme();

    // Refresh count when screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            const getCount = async () => {
                try {
                    const jsonValue = await AsyncStorage.getItem('vocabList');
                    const words = jsonValue != null ? JSON.parse(jsonValue) : [];
                    setWordCount(words.length);
                } catch (e) {
                    // error reading value
                }
            };
            getCount();
        }, [])
    );

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
            <View className="flex-row justify-end p-4">
                <TouchableOpacity
                    onPress={() => navigation.navigate('Settings')}
                    className="p-2"
                >
                    <Feather name="settings" size={24} color={colorScheme === 'dark' ? 'white' : '#111827'} />
                </TouchableOpacity>
            </View>

            <View className="flex-1 items-center justify-center p-6 -mt-12">
                <Text className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Argot</Text>
                <Text className="text-gray-500 dark:text-gray-400 mb-10">{wordCount} words collected</Text>

                <TouchableOpacity
                    className="bg-blue-600 w-full p-4 rounded-xl mb-4 items-center"
                    onPress={() => navigation.navigate('AddWord')}
                >
                    <Text className="text-white text-lg font-bold">Add New Word</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-gray-800 dark:bg-gray-700 w-full p-4 rounded-xl mb-4 items-center"
                    onPress={() => navigation.navigate('List')}
                >
                    <Text className="text-white text-lg font-bold">My Vocabulary</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-purple-600 w-full p-4 rounded-xl mb-4 items-center"
                    onPress={() => navigation.navigate('Quiz')}
                >
                    <Text className="text-white text-lg font-bold">Start Quiz</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
