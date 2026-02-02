// Run with: node scripts/test_dictionary_implementation.js
require('dotenv').config();

const MERRIAM_WEBSTER_KEY = process.env.MERRIAM_WEBSTER_KEY;

const FREE_DICT_API = 'https://api.dictionaryapi.dev/api/v2/entries/en';
const MW_API_BASE = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json';

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
                            source: 'FreeDict'
                        });
                    });
                });
            }
        });
    }
    return definitions;
};

const cleanMWString = (str) => {
    if (!str) return null;
    return str
        .replace(/{bc}/g, ': ')
        .replace(/{it}/g, '')
        .replace(/{\/it}/g, '')
        .replace(/{wi}/g, '')
        .replace(/{\/wi}/g, '')
        .replace(/{\/sup}/g, '')
        .replace(/(\s+)/g, ' ')
        .trim();
};

const formatSentence = (str) => {
    if (!str) return null;
    let clean = cleanMWString(str);
    if (!clean) return null;
    clean = clean.replace(/\s+:\s+/g, ': ');
    clean = clean.replace(/( \-)|(\- )/g, ' - ');
    clean = clean.charAt(0).toUpperCase() + clean.slice(1);
    if (!/[.?!]$/.test(clean)) clean += '.';
    return clean;
};

const getExamplesFromEntry = (entry) => {
    const examples = [];
    if (entry.def && Array.isArray(entry.def)) {
        for (const defSection of entry.def) {
            if (defSection.sseq) {
                for (const senseBatch of defSection.sseq) {
                    for (const senseItem of senseBatch) {
                        if (Array.isArray(senseItem) && senseItem[1] && senseItem[1].dt) {
                            const dt = senseItem[1].dt;
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

const normalizeMW = (data) => {
    const definitions = [];
    if (Array.isArray(data)) {
        data.forEach(entry => {
            if (typeof entry === 'object' && entry.shortdef && entry.fl) {
                const examples = getExamplesFromEntry(entry);
                entry.shortdef.forEach((def, index) => {
                    let formattedDef = formatSentence(def);
                    if (formattedDef) {
                        definitions.push({
                            definition: formattedDef,
                            partOfSpeech: entry.fl,
                            source: 'Merriam-Webster',
                            example: examples[index] || (index === 0 ? examples[0] : null)
                        });
                    }
                });
            }
        });
    }
    return definitions;
};

async function testWord(word, forceFallback = false) {
    console.log(`\n--- Testing Word: "${word}" (Force Fallback: ${forceFallback}) ---`);

    // 1. Try Primary
    if (!forceFallback) {
        try {
            console.log(`Attempting Primary API...`);
            const response = await fetch(`${FREE_DICT_API}/${word}`);
            if (response.ok) {
                const data = await response.json();
                const results = normalizeFreeDict(data);
                if (results.length > 0) {
                    console.log(`✅ Success (Primary): Found ${results.length} definitions.`);
                    console.log(`   Sample: ${results[0].definition}`);
                    return;
                }
            } else {
                console.log(`❌ Primary API failed with status: ${response.status}`);
            }
        } catch (e) {
            console.log(`❌ Primary API error: ${e.message}`);
        }
    } else {
        console.log(`⏭️  Skipping Primary API (Forced)...`);
    }

    // 2. Try Fallback
    if (!MERRIAM_WEBSTER_KEY || MERRIAM_WEBSTER_KEY === 'your_api_key_here') {
        console.log('⚠️  Skipping Fallback: Missing API Key in .env');
        return;
    }

    try {
        console.log(`Attempting Fallback (Merriam-Webster)...`);
        const url = `${MW_API_BASE}/${word}?key=${MERRIAM_WEBSTER_KEY}`;
        const response = await fetch(url);

        if (response.ok) {
            const data = await response.json();
            if (data.length > 0 && typeof data[0] === 'object') {
                console.log('--- MW Response Snippet (First Entry) ---');
                // Log the first entry to inspect 'def' structure for examples
                console.dir(data[0], { depth: null, colors: true });

                const results = normalizeMW(data);
                console.log(`✅ Success (Fallback): Found ${results.length} definitions.`);
                console.log(`   Sample: ${results[0].definition}`);
            } else {
                console.log(`❌ Fallback API returned no valid entries (Msg: ${JSON.stringify(data).substring(0, 50)}...)`);
            }
        } else {
            console.log(`❌ Fallback API failed with status: ${response.status}`);
        }
    } catch (e) {
        console.log(`❌ Fallback API error: ${e.message}`);
    }
}

async function run() {
    // Test 1: Easy word (expect Primary)
    await testWord('apple');

    // Test 2: "Hell" (expect Fallback if primary fails as user claims, or we see what happens)
    await testWord('hell');

    // Test 3: Force Fallback on common word to prove MW integration works
    await testWord('adventure', true);
}

run();
