require('dotenv').config();

const MERRIAM_WEBSTER_KEY = process.env.MERRIAM_WEBSTER_KEY;
const MW_API_BASE = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json';

async function debugWord(word) {
    console.log(`\n--- Debugging Word: "${word}" ---`);
    const url = `${MW_API_BASE}/${word}?key=${MERRIAM_WEBSTER_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.length > 0 && typeof data[0] === 'object') {
        const entry = data[0];
        console.log('Shortdefs (Raw):');
        entry.shortdef.forEach((d, i) => {
            console.log(`[${i}]: '${d}'`);
        });

        console.log('\nformatting test:');
        entry.shortdef.forEach((d, i) => {
            let formattedDef = d.trim();
            if (formattedDef.length > 0) {
                formattedDef = formattedDef.charAt(0).toUpperCase() + formattedDef.slice(1);
                if (!formattedDef.endsWith('.')) formattedDef += '.';
            }
            console.log(`[${i}] Formatted: '${formattedDef}'`);
        });

    } else {
        console.log("No entry found or invalid format");
    }
}

debugWord('hell');
debugWord('adventure');
