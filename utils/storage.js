import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'vocabList';

export const getWords = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Error loading words:', e);
        return [];
    }
};

export const saveWords = async (words) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(words));
        return true;
    } catch (e) {
        console.error('Error saving words:', e);
        return false;
    }
};

export const addWord = async (newWord) => {
    const words = await getWords();

    const isDuplicate = words.some(existingItem =>
        existingItem.word.toLowerCase() === newWord.word.toLowerCase() &&
        existingItem.definition === newWord.definition
    );

    if (isDuplicate) {
        return { success: false, error: 'duplicate' };
    }

    const updatedWords = [newWord, ...words];
    await saveWords(updatedWords);
    return { success: true };
};

export const updateWord = async (updatedWord) => {
    const words = await getWords();
    const newWords = words.map(w => w.id === updatedWord.id ? updatedWord : w);
    await saveWords(newWords);
    return newWords;
};

export const deleteWords = async (idsToDelete) => {
    const words = await getWords();
    const ids = idsToDelete instanceof Set ? idsToDelete : new Set(idsToDelete);
    const newWords = words.filter(item => !ids.has(item.id));
    await saveWords(newWords);
    return newWords;
};

export const updateWordStats = async (wordId, isCorrect) => {
    const words = await getWords();
    const updatedWords = words.map(w => {
        if (w.id === wordId) {
            const currentStats = w.stats || { correct: 0, incorrect: 0 };
            return {
                ...w,
                stats: {
                    correct: currentStats.correct + (isCorrect ? 1 : 0),
                    incorrect: currentStats.incorrect + (isCorrect ? 0 : 1)
                }
            };
        }
        return w;
    });
    await saveWords(updatedWords);
    return updatedWords;
};
