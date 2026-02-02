/**
 * Returns the Tailwind classes for a given Part of Speech (POS).
 * Handles variations from different dictionary sources (FreeDict, Merriam-Webster).
 * 
 * @param {string} pos - The part of speech string (e.g., "noun", "verb", "transitive verb")
 * @returns {string} Tailwind class string for background, text color, and border.
 */
export const getPosStyle = (pos) => {
    if (!pos) return 'bg-gray-800 text-gray-400 border-gray-600';

    const p = pos.toLowerCase().trim();

    // Helper for exact matches or reliable prefixes
    const is = (type) => p === type;
    const starts = (prefix) => p.startsWith(prefix + ' ');

    // Adverb (Check before verb to avoid overlap)
    if (is('adverb') || is('adv') || starts('adverb')) {
        return 'bg-cyan-900/40 text-cyan-300 border-cyan-500/30';
    }

    // Verb
    if (is('verb') || is('v') || is('vt') || is('vi') || p.includes('verb')) {
        // Note: 'includes' is safe here because 'adverb' was already caught above.
        // We want to catch "transitive verb", "intransitive verb" etc.
        return 'bg-green-900/40 text-green-300 border-green-500/30';
    }

    // Noun
    if (is('noun') || is('n') || p.includes('noun')) {
        return 'bg-blue-900/40 text-blue-300 border-blue-500/30';
    }

    // Adjective
    if (is('adjective') || is('adj') || p.includes('adjective')) {
        return 'bg-orange-900/40 text-orange-300 border-orange-500/30';
    }

    // Pronoun
    if (is('pronoun') || is('pron') || p.includes('pronoun')) {
        return 'bg-pink-900/40 text-pink-300 border-pink-500/30';
    }

    // Preposition
    if (is('preposition') || is('prep') || p.includes('preposition')) {
        return 'bg-teal-900/40 text-teal-300 border-teal-500/30';
    }

    // Conjunction
    if (is('conjunction') || is('conj') || p.includes('conjunction')) {
        return 'bg-indigo-900/40 text-indigo-300 border-indigo-500/30';
    }

    // Interjection/Exclamation
    if (p.includes('interjection') || p.includes('exclamation') || is('interj')) {
        return 'bg-yellow-900/40 text-yellow-300 border-yellow-500/30';
    }

    // Determiner/Article
    if (p.includes('determiner') || p.includes('article')) {
        return 'bg-gray-700 text-gray-300 border-gray-500';
    }

    // Abbreviations & Symbols
    if (p.includes('abbreviation') || p.includes('symbol')) {
        return 'bg-slate-700 text-slate-300 border-slate-500';
    }

    // Names (Biographical, Geographical)
    if (p.includes('biographical') || p.includes('geographical') || p.includes('name')) {
        return 'bg-purple-900/40 text-purple-300 border-purple-500/30';
    }

    // Idioms & Phrases
    if (p.includes('idiom') || p.includes('phrase')) {
        return 'bg-lime-900/40 text-lime-300 border-lime-500/30';
    }

    // Prefixes, Suffixes, Combining forms
    if (p.includes('prefix') || p.includes('suffix') || p.includes('combining')) {
        return 'bg-sky-900/40 text-sky-300 border-sky-500/30';
    }

    // Fallback for everything else (e.g. "biographical name", "abbreviation")
    return 'bg-rose-900/40 text-rose-300 border-rose-500/30';
};
