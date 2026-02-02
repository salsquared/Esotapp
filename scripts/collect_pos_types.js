
require('dotenv').config();

const MERRIAM_WEBSTER_KEY = process.env.MERRIAM_WEBSTER_KEY;
const FREE_DICT_API = 'https://api.dictionaryapi.dev/api/v2/entries/en';
const MW_API_BASE = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json';

// Logic mirrored from utils/posStyles.js (converted to simple function for testing)
function getMirroredResult(pos) {
    if (!pos) return 'UNKNOWN';
    const p = pos.toLowerCase().trim();
    const is = (type) => p === type;
    const starts = (prefix) => p.startsWith(prefix + ' ');

    if (is('adverb') || is('adv') || starts('adverb')) return 'KNOWN';
    if (is('verb') || is('v') || is('vt') || is('vi') || p.includes('verb')) return 'KNOWN';
    if (is('noun') || is('n') || p.includes('noun')) return 'KNOWN';
    if (is('adjective') || is('adj') || p.includes('adjective')) return 'KNOWN';
    if (is('pronoun') || is('pron') || p.includes('pronoun')) return 'KNOWN';
    if (is('preposition') || is('prep') || p.includes('preposition')) return 'KNOWN';
    if (is('conjunction') || is('conj') || p.includes('conjunction')) return 'KNOWN';
    if (p.includes('interjection') || p.includes('exclamation') || is('interj')) return 'KNOWN';
    if (p.includes('determiner') || p.includes('article')) return 'KNOWN';

    // NEW CHECKS ADDED
    if (p.includes('abbreviation') || p.includes('symbol')) return 'KNOWN';
    if (p.includes('biographical') || p.includes('geographical') || p.includes('name')) return 'KNOWN';
    if (p.includes('idiom') || p.includes('phrase')) return 'KNOWN';
    if (p.includes('prefix') || p.includes('suffix') || p.includes('combining')) return 'KNOWN';

    return 'UNKNOWN';
}

// List of diverse words to maximize POS coverage
const TEST_WORDS = [
    'run', 'quickly', 'happiness', 'blue', 'he', 'in', 'and', 'wow', 'the', // Basics
    'well', 'fast', 'close', // Multiple POS
    'myself', 'this', // Pronouns
    'pre', 'anti', // Prefixes (might return special POS)
    'ism', 'ness', // Suffixes
    'dr', 'mr', 'etc', // Abbreviations
    'new york', 'ice cream', // Compounds
    'of', 'for', 'with', // Prepositions
    'light', 'set', // Polysemy
    'ph.d.', 'mph', // Acronyms
    '1990', 'twenty', // Numbers
    'shh', 'ouch', // Interjections
    'what', 'which', // Interrogative
    'biographical', 'geographical', // Specific types
    'nasa', '$'
];

function isKnown(pos) {
    return getMirroredResult(pos) === 'KNOWN';
}

const collectedPOS = new Set();
const unknownPOS = new Set();

const normalizeFreeDict = (data) => {
    if (Array.isArray(data)) {
        data.forEach(entry => {
            if (entry.meanings) {
                entry.meanings.forEach(meaning => {
                    if (meaning.partOfSpeech) {
                        collectedPOS.add(meaning.partOfSpeech);
                        if (!isKnown(meaning.partOfSpeech)) {
                            unknownPOS.add(`FreeDict: ${meaning.partOfSpeech}`);
                        }
                    }
                });
            }
        });
    }
};

const normalizeMW = (data) => {
    if (Array.isArray(data)) {
        data.forEach(entry => {
            if (typeof entry === 'object' && entry.fl) {
                collectedPOS.add(entry.fl);
                if (!isKnown(entry.fl)) {
                    unknownPOS.add(`MW: ${entry.fl}`);
                }
            }
        });
    }
};

async function checkWord(word) {
    // 1. Check Free Dictionary
    try {
        const res = await fetch(`${FREE_DICT_API}/${word}`);
        if (res.ok) {
            const data = await res.json();
            normalizeFreeDict(data);
        }
    } catch (e) {
        // ignore errors
    }

    // 2. Check Merriam-Webster
    if (MERRIAM_WEBSTER_KEY && MERRIAM_WEBSTER_KEY !== 'your_api_key_here') {
        try {
            const url = `${MW_API_BASE}/${word}?key=${MERRIAM_WEBSTER_KEY}`;
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                normalizeMW(data);
            }
        } catch (e) {
            // ignore
        }
    }
}

async function run() {
    console.log(`Scanning ${TEST_WORDS.length} words for POS types...`);

    for (const word of TEST_WORDS) {
        process.stdout.write(`.`);
        await checkWord(word);
    }

    console.log('\n\n--- scan complete ---');
    console.log('All Collected POS:', [...collectedPOS].sort());

    console.log('\n--- Unknown / Unhandled POS Types ---');
    if (unknownPOS.size === 0) {
        console.log('None! All discovered POS types are handled.');
    } else {
        [...unknownPOS].sort().forEach(p => console.log(p));
    }
}

run();
