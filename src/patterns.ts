export const translationPatterns = [
    // Common informal phrases
    { pt: /^ah\s+sei\s+lá/i, en: "Idk" },
    { pt: /sei\s+lá/i, en: "idk" },
    { pt: /nossa/i, en: "Man" },
    { pt: /caramba/i, en: "Bro" },
    { pt: /mano/i, en: "Bruh" },
    { pt: /cara/i, en: "guy" },
    { pt: /muito\s+chato\s+e\s+irritante/i, en: "doing too much" },
    { pt: /está\s+bom\s+demais/i, en: "hits different" },
    { pt: /estou\s+viciado/i, en: "I'm hooked" },
    { pt: /mentira\s+que/i, en: "No shot" },
    { pt: /não\s+acredito\s+de\s+jeito\s+nenhum/i, en: "ain't no way" },
    { pt: /concordo\s+plenamente/i, en: "Real" },
    { pt: /tamo\s+junto/i, en: "I feel you on that, bet" },
    { pt: /deixa\s+quieto/i, en: "Nvm" },
    { pt: /cansei\s+disso/i, en: "I'm over it" },
    { pt: /querendo\s+aparecer\s+demais/i, en: "chasing clout so hard" },
    { pt: /tô\s+rindo\s+muito.*kk+/i, en: "I'm dead af rn lmao" },
    { pt: /jogou\s+muito\s+mal/i, en: "threw so hard" },
    { pt: /passou\s+vergonha/i, en: "that was embarrassing" },
    { pt: /pode\s+confiar\s+em\s+mim/i, en: "Trust me" },
    { pt: /é\s+verdade\s+mesmo/i, en: "it's valid, no cap" },
    { pt: /servidor\s+tá\s+completamente\s+parado/i, en: "the server is dead, it's a ghost town" },
    { pt: /vou\s+dar\s+uma\s+saída\s+rápida/i, en: "gonna step away real quick" },
    { pt: /brb/i, en: "brb" },
    { pt: /ficou\s+muito\s+bravo/i, en: "got so tilted" },
    { pt: /do\s+nada/i, en: "over nothing" },
    { pt: /é\s+bom\s+demais/i, en: "is elite, ngl" },
    { pt: /cansei\s+de\s+discutir/i, en: "I'm done dealing with these casuals" },
    { pt: /com\s+esse\s+povo/i, en: "with these casuals" },
];

export const slangWords: Record<string, string> = {
    // Interjections
    "ah": "Ugh",
    "nossa": "Damn",
    "caramba": "Bro",
    "mano": "Bruh",
    
    // Verbs
    "é": "is",
    "está": "is",
    "tá": "is",
    "estou": "I'm",
    "tô": "I'm",
    "vou": "gonna",
    
    // Descriptors
    "chato": "annoying",
    "irritante": "annoying",
    "bom": "good",
    "legal": "cool",
    "chique": "elite",
    "bom demais": "fire",
    
    // Slang terms
    "viciado": "hooked",
    "verdade": "facts",
    "confiar": "trust",
    "falou": "said",
    "parado": "dead",
    "bravo": "tilted",
    "discutir": "dealing with",
};

export async function translateWithSlang(text: string): Promise<string> {
    try {
        // Try to match patterns first
        for (const pattern of translationPatterns) {
            if (pattern.pt.test(text)) {
                text = text.replace(pattern.pt, pattern.en);
            }
        }

        // Use Google Translate API for remaining text
        const API_URL = "https://translate.googleapis.com/translate_a/single?" + new URLSearchParams({
            client: "gtx",
            sl: "pt",
            tl: "en",
            dt: "t",
            dj: "1",
            source: "input",
            q: text
        });

        const response = await fetch(API_URL);
        const data = await response.json();

        if (!data.sentences) {
            throw new Error("Invalid response from API");
        }

        let translated = data.sentences.map((s: any) => s.trans).join('');

        // Apply slang enhancements
        Object.entries(slangWords).forEach(([pt, en]) => {
            const regex = new RegExp(`\\b${pt}\\b`, 'gi');
            translated = translated.replace(regex, en);
        });

        return translated;
    } catch (e) {
        throw new Error(`Translation failed: ${e}`);
    }
}
