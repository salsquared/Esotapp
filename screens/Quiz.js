import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

export default function Quiz({ navigation }) {
    const [words, setWords] = useState([]);
    const [gameState, setGameState] = useState('menu'); // menu, playing, feedback, finished
    const [mode, setMode] = useState(null); // 'written', 'mc_def', 'mc_word'
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [score, setScore] = useState(0);
    const [textInput, setTextInput] = useState('');
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [feedback, setFeedback] = useState(null); // { correct: bool, message: string }

    useFocusEffect(
        React.useCallback(() => {
            loadWords();
            setGameState('menu');
            setScore(0);
        }, [])
    );

    const loadWords = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('vocabList');
            const loadedWords = jsonValue != null ? JSON.parse(jsonValue) : [];
            setWords(loadedWords);
        } catch (e) { console.error(e); }
    };

    const startGame = (selectedMode) => {
        if (words.length < 4 && (selectedMode === 'mc_def' || selectedMode === 'mc_word')) {
            Alert.alert("Not enough words", "You need at least 4 words specifically for Multiple Choice modes!");
            return;
        }
        if (words.length < 1) {
            Alert.alert("No words", "Please add some words first!");
            return;
        }
        Haptics.selectionAsync();
        setMode(selectedMode);
        setScore(0);
        setGameState('playing');
        generateQuestion(selectedMode);
    };

    const generateQuestion = (currentMode) => {
        setFeedback(null);
        setTextInput('');
        setSelectedAnswer(null);

        const targetIndex = Math.floor(Math.random() * words.length);
        const target = words[targetIndex];

        let questionData = { target };

        if (currentMode === 'mc_def' || currentMode === 'mc_word') {
            const distractors = [];
            const availableIndices = words.map((_, i) => i).filter(i => i !== targetIndex);

            // Select 3 distractors
            for (let i = 0; i < 3; i++) {
                if (availableIndices.length === 0) break;
                const randPos = Math.floor(Math.random() * availableIndices.length);
                const distractorIndex = availableIndices.splice(randPos, 1)[0];
                distractors.push(words[distractorIndex]);
            }

            // Shuffle options including target
            const options = [...distractors, target].sort(() => Math.random() - 0.5);
            questionData.options = options;
        }

        setCurrentQuestion(questionData);
    };

    const checkAnswer = (answer) => {
        setSelectedAnswer(answer);
        const isCorrect =
            mode === 'written'
                ? answer.trim().toLowerCase() === currentQuestion.target.word.toLowerCase()
                : answer.id === currentQuestion.target.id;

        if (isCorrect) {
            setScore(score + 1);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }

        setFeedback({
            correct: isCorrect,
            message: isCorrect ? 'Correct!' : `Wrong! It was "${currentQuestion.target.word}"`
        });
        setGameState('feedback');
    };

    const nextQuestion = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setGameState('playing');
        generateQuestion(mode);
    };

    if (gameState === 'menu') {
        return (
            <View className="flex-1 bg-gray-900 justify-center p-6">
                <Text className="text-white text-3xl font-bold mb-8 text-center">Select Quiz Mode</Text>

                <TouchableOpacity className="bg-blue-600 p-5 rounded-xl mb-4" onPress={() => startGame('written')}>
                    <Text className="text-white text-xl font-bold text-center">Written (Hard)</Text>
                    <Text className="text-gray-200 text-center text-sm">Type the word from definition</Text>
                </TouchableOpacity>

                <TouchableOpacity className="bg-purple-600 p-5 rounded-xl mb-4" onPress={() => startGame('mc_word')}>
                    <Text className="text-white text-xl font-bold text-center">Pick the Definition</Text>
                    <Text className="text-gray-200 text-center text-sm">Word provided → Choose Meaning</Text>
                </TouchableOpacity>

                <TouchableOpacity className="bg-indigo-600 p-5 rounded-xl mb-4" onPress={() => startGame('mc_def')}>
                    <Text className="text-white text-xl font-bold text-center">Pick the Word</Text>
                    <Text className="text-gray-200 text-center text-sm">Meaning provided → Choose Word</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (gameState === 'playing' || gameState === 'feedback') {
        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-gray-900 p-6">
                <View className="flex-row justify-between mb-8 mt-4">
                    <Text className="text-gray-400">Score: {score}</Text>
                    <TouchableOpacity onPress={() => setGameState('menu')}>
                        <Text className="text-red-400">Exit</Text>
                    </TouchableOpacity>
                </View>

                {/* Display Question Prompt */}
                <View className="mb-8">
                    <Text className="text-gray-400 text-lg mb-2 text-center">
                        {mode === 'mc_word' ? 'What is the definition of:' : 'What word matches this definition?'}
                    </Text>
                    <Text className="text-white text-3xl font-bold text-center p-4 bg-gray-800 rounded-xl">
                        {mode === 'mc_word' ? currentQuestion.target.word : currentQuestion.target.definition}
                    </Text>
                </View>

                {/* Input Area */}
                {mode === 'written' ? (
                    <View>
                        <TextInput
                            className="bg-gray-800 text-white p-4 rounded-xl mb-6 text-xl border border-gray-700 text-center"
                            placeholder="Type the word..."
                            placeholderTextColor="#6b7280"
                            value={textInput}
                            onChangeText={setTextInput}
                            editable={gameState === 'playing'}
                            autoCapitalize="none"
                        />
                        {gameState === 'playing' && (
                            <TouchableOpacity className="bg-blue-600 p-4 rounded-xl" onPress={() => checkAnswer(textInput)}>
                                <Text className="text-white text-xl font-bold text-center">Submit</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ) : (
                    <View>
                        {currentQuestion.options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                disabled={gameState !== 'playing'}
                                className={`p-4 rounded-xl mb-3 border ${gameState === 'feedback'
                                        ? (option.id === currentQuestion.target.id ? 'bg-green-600 border-green-600' : (option.id === selectedAnswer?.id ? 'bg-red-600 border-red-600' : 'bg-gray-800 border-gray-700'))
                                        : 'bg-gray-800 border-gray-700 active:bg-blue-900'
                                    }`}
                                onPress={() => checkAnswer(option)}
                            >
                                <Text className="text-white text-lg">
                                    {mode === 'mc_word' ? option.definition : option.word}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Feedback Area */}
                {gameState === 'feedback' && (
                    <View className="mt-8 items-center">
                        <Text className={`text-2xl font-bold mb-4 ${feedback.correct ? 'text-green-400' : 'text-red-400'}`}>
                            {feedback.message}
                        </Text>
                        <TouchableOpacity className="bg-blue-600 px-8 py-3 rounded-xl" onPress={nextQuestion}>
                            <Text className="text-white text-xl font-bold">Next Question</Text>
                        </TouchableOpacity>
                    </View>
                )}

            </ScrollView>
        );
    }

    return <View className="flex-1 bg-gray-900" />;
}
