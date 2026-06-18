import { logger } from "@vendetta";
import { registerCommand } from "@vendetta/commands";
import { findByProps } from "@vendetta/metro";
import { showConfirmationAlert } from "@vendetta/ui/alerts";

const ClydeUtils = findByProps("sendBotMessage");

const translationPatterns: Array<{ pt: RegExp; en: string }> = [
    { pt: /^ah\s+sei\s+lá/i, en: "Idk" },
    { pt: /sei\s+lá/i, en: "idk" },
    { pt: /nossa/i, en: "Man" },
    { pt: /caramba/i, en: "Bro" },
    { pt: /mano/i, en: "Bruh" },
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
    { pt: /ficou\s+muito\s+bravo/i, en: "got so tilted" },
    { pt: /é\s+bom\s+demais/i, en: "is elite, ngl" },
    { pt: /cansei\s+de\s+discutir/i, en: "I'm done dealing with these casuals" },
];

const slangWords: Record<string, string> = {
    "ai": "yo",
    "aí": "there",
    "é": "is",
    "tá": "is",
    "tô": "I'm",
    "vou": "gonna",
    "cara": "dude",
    "bro": "bro",
};

async function translateWithSlang(text: string): Promise<string> {
    try {
        let translated = text;

        for (const pattern of translationPatterns) {
            if (pattern.pt.test(translated)) {
                translated = translated.replace(pattern.pt, pattern.en);
            }
        }

        const API_URL =
            "https://translate.googleapis.com/translate_a/single?" +
            new URLSearchParams({
                client: "gtx",
                sl: "pt",
                tl: "en",
                dt: "t",
                dj: "1",
                source: "input",
                q: translated,
            });

        const response = await fetch(API_URL);
        const data = await response.json();

        if (!data.sentences) {
            throw new Error("Invalid response");
        }

        translated = data.sentences.map((s: any) => s.trans).join("");

        Object.entries(slangWords).forEach(([pt, en]) => {
            const regex = new RegExp(`\\b${pt}\\b`, "gi");
            translated = translated.replace(regex, en);
        });

        return translated;
    } catch (e) {
        throw new Error(`Translation failed: ${e}`);
    }
}

export default {
    onLoad: () => {
        registerCommand({
            name: "tr",
            displayName: "tr",
            description: "Traduz português para inglês com gírias",
            displayDescription: "Traduz português para inglês com gírias",
            applicationId: "-1",
            type: 1,
            inputType: 1,
            options: [
                {
                    name: "text",
                    displayName: "text",
                    description: "Texto em português",
                    displayDescription: "Texto em português",
                    type: 3,
                    required: true,
                },
            ],
            async execute(args: any[], ctx: any) {
                try {
                    const text = args[0].value;
                    const translated = await translateWithSlang(text);

                    return await new Promise((resolve) =>
                        showConfirmationAlert({
                            title: "Tradução",
                            content: translated,
                            confirmText: "Enviar",
                            onConfirm: () =>
                                resolve({ content: translated }),
                            cancelText: "Cancelar",
                        })
                    );
                } catch (e) {
                    logger.error(e);
                    return ClydeUtils.sendBotMessage(
                        ctx.channel.id,
                        "Erro na tradução"
                    );
                }
            },
        });
    },
};
