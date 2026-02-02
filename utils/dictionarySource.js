import { MERRIAM_WEBSTER_KEY } from '@env';

const FREE_DICT_API = 'https://api.dictionaryapi.dev/api/v2/entries/en';
const MW_API_BASE = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json';

/**
 * Normalizes Free Dictionary API response
 */
const normalizeFreeDict = (data) => {
    const definitions = [];
    if (Array.isArray(data)) {
        data.forEach(entry => {
            if (entry.meanings) {
                entry.meanings.forEach(meaning => {
                    meaning.definitions.forEach(def => {
                        definitions.push({
                            definition: def.definition,
                            partOfSpeech: meaning.partOfSpeech,
                            example: def.example
                        });
                    });
                });
            }
        });
    }
    return definitions;
};


/**
 * Helper to clean MW formatting (e.g. {it}, {wi}, {bc})
 */
const cleanMWString = (str) => {
    if (!str) return null;
    return str
        .replace(/{bc}/g, ': ')
        .replace(/{it}/g, '')
        .replace(/{\/it}/g, '')
        .replace(/{wi}/g, '')
        .replace(/{\/wi}/g, '')
        .replace(/{sup}/g, '')
        .replace(/{\/sup}/g, '')
        .replace(/(\s+)/g, ' ') // Collapse multiple spaces
        .trim();
};

/**
 * Helper to ensure sentence case and proper punctuation
 */
const formatSentence = (str) => {
    if (!str) return null;

    // 1. Clean MW tags first
    let clean = cleanMWString(str);
    if (!clean) return null;

    // 2. Fix Colon Spacing: " : " -> ": "
    clean = clean.replace(/\s+:\s+/g, ': ');

    // 3. Fix Dash Spacing: " -" or "- " -> " - "
    // Match any hyphen that has at least one space adjacent to it
    clean = clean.replace(/( \-)|(\- )/g, ' - ');

    // 4. Capitalize First Letter
    clean = clean.charAt(0).toUpperCase() + clean.slice(1);

    // 5. Ensure Period at end (if not ending in . ? !)
    if (!/[.?!]$/.test(clean)) {
        clean += '.';
    }

    return clean;
};

/**
 * Helper to extract the first 'vis' (example) from an entry's deep structure
 */
const getExamplesFromEntry = (entry) => {
    const examples = [];
    if (entry.def && Array.isArray(entry.def)) {
        for (const defSection of entry.def) {
            if (defSection.sseq) {
                for (const senseBatch of defSection.sseq) {
                    for (const senseItem of senseBatch) {
                        // senseItem is often ['sense', { dt: ... }]
                        if (Array.isArray(senseItem) && senseItem[1] && senseItem[1].dt) {
                            const dt = senseItem[1].dt;
                            // dt is an array of formatted text blocks e.g. [['text', '...'], ['vis', [...]]]
                            for (const dtItem of dt) {
                                if (dtItem[0] === 'vis' && Array.isArray(dtItem[1])) {
                                    for (const visItem of dtItem[1]) {
                                        if (visItem.t) {
                                            const formatted = formatSentence(visItem.t);
                                            if (formatted) examples.push(formatted);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return examples;
};

/**
 * Normalizes Merriam-Webster API response
 */
const normalizeMW = (data) => {
    const definitions = [];
    if (Array.isArray(data)) {
        data.forEach(entry => {
            // MW sometimes returns strings for suggestions if word not found exactly
            if (typeof entry === 'object' && entry.shortdef && entry.fl) {
                const examples = getExamplesFromEntry(entry);

                entry.shortdef.forEach((def, index) => {
                    // Use shared formatter for consistent punctuation/casing
                    const formattedDef = formatSentence(def);

                    if (formattedDef) {
                        definitions.push({
                            definition: formattedDef,
                            partOfSpeech: entry.fl,
                            // Try to assign an example to the definition
                            example: examples[index] || (index === 0 ? examples[0] : null)
                        });
                    }
                });
            }
        });
    }
    return definitions;
};

export const fetchWordDefinition = async (word, signal) => {
    // 1. Try Free Dictionary API
    try {
        console.log(`[DictSource] Try Primary: ${word}`);
        const response = await fetch(`${FREE_DICT_API}/${word}`, { signal });

        if (response.ok) {
            const data = await response.json();
            const results = normalizeFreeDict(data);
            if (results.length > 0) return { source: 'FreeDict', data: results };
        }
    } catch (error) {
        if (error.name === 'AbortError') throw error;
        console.warn('[DictSource] Primary failed:', error);
    }

    // 2. Try Merriam-Webster API
    if (MERRIAM_WEBSTER_KEY && MERRIAM_WEBSTER_KEY !== 'your_api_key_here') {
        try {
            console.log(`[DictSource] Try Fallback (MW): ${word}`);
            const mwUrl = `${MW_API_BASE}/${word}?key=${MERRIAM_WEBSTER_KEY}`;
            const response = await fetch(mwUrl, { signal });

            if (response.ok) {
                const data = await response.json();
                // Check if it's a list of suggestions (strings) or real entries (objects)
                if (data.length > 0 && typeof data[0] === 'object') {
                    const results = normalizeMW(data);
                    if (results.length > 0) return { source: 'Merriam-Webster', data: results };
                }
            }
        } catch (error) {
            if (error.name === 'AbortError') throw error;
            console.warn('[DictSource] Fallback failed:', error);
        }
    } else {
        console.log('[DictSource] fallback key missing or default');
    }

    throw new Error('Word not found in any source');
};
