
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
        .replace(/\u2026/g, '...') // Normalize unicode ellipsis to 3 dots
        .replace(/(\s+)/g, ' ') // Collapse multiple spaces
        .replace(/\.\.\. /g, '...') // Remove trailing space from ellipses (USER REQUESTED CHANGE)
        .trim();
};

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

const TEST_CASES = [
    "A standard example sentence.",
    "An example ending in ... ",
    "An example ending in ...",
    "An example with ... in the middle.",
    "Unicode ellipsis\u2026 ",
    "   Leading spaces...",
    "Trailing spaces   ",
    "{it}Italic{/it} text",
    "Sentences ... with ... spaces"
];

console.log("--- CLEANING TESTS ---");
TEST_CASES.forEach(t => {
    console.log(`ORIG: [${t}]`);
    console.log(`FMT : [${formatSentence(t)}]`);
    console.log('---');
});
