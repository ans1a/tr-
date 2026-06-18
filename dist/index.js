(() => {
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });

  // src/index.ts
  var import_vendetta = __require("@vendetta");
  var import_commands = __require("@vendetta/commands");
  var import_metro = __require("@vendetta/metro");
  var import_alerts = __require("@vendetta/ui/alerts");
  var ClydeUtils = (0, import_metro.findByProps)("sendBotMessage");
  var translationPatterns = [
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
    { pt: /cansei\s+de\s+discutir/i, en: "I'm done dealing with these casuals" }
  ];
  var slangWords = {
    "ai": "yo",
    "a\xED": "there",
    "\xE9": "is",
    "t\xE1": "is",
    "t\xF4": "I'm",
    "vou": "gonna",
    "cara": "dude",
    "bro": "bro"
  };
  async function translateWithSlang(text) {
    try {
      let translated = text;
      for (const pattern of translationPatterns) {
        if (pattern.pt.test(translated)) {
          translated = translated.replace(pattern.pt, pattern.en);
        }
      }
      const API_URL = "https://translate.googleapis.com/translate_a/single?" + new URLSearchParams({
        client: "gtx",
        sl: "pt",
        tl: "en",
        dt: "t",
        dj: "1",
        source: "input",
        q: translated
      });
      const response = await fetch(API_URL);
      const data = await response.json();
      if (!data.sentences) {
        throw new Error("Invalid response");
      }
      translated = data.sentences.map((s) => s.trans).join("");
      Object.entries(slangWords).forEach(([pt, en]) => {
        const regex = new RegExp(`\\b${pt}\\b`, "gi");
        translated = translated.replace(regex, en);
      });
      return translated;
    } catch (e) {
      throw new Error(`Translation failed: ${e}`);
    }
  }
  var src_default = {
    onLoad: () => {
      (0, import_commands.registerCommand)({
        name: "tr",
        displayName: "tr",
        description: "Traduz portugu\xEAs para ingl\xEAs com g\xEDrias",
        displayDescription: "Traduz portugu\xEAs para ingl\xEAs com g\xEDrias",
        applicationId: "-1",
        type: 1,
        inputType: 1,
        options: [
          {
            name: "text",
            displayName: "text",
            description: "Texto em portugu\xEAs",
            displayDescription: "Texto em portugu\xEAs",
            type: 3,
            required: true
          }
        ],
        async execute(args, ctx) {
          try {
            const text = args[0].value;
            const translated = await translateWithSlang(text);
            return await new Promise(
              (resolve) => (0, import_alerts.showConfirmationAlert)({
                title: "Tradu\xE7\xE3o",
                content: translated,
                confirmText: "Enviar",
                onConfirm: () => resolve({ content: translated }),
                cancelText: "Cancelar"
              })
            );
          } catch (e) {
            import_vendetta.logger.error(e);
            return ClydeUtils.sendBotMessage(
              ctx.channel.id,
              "Erro na tradu\xE7\xE3o"
            );
          }
        }
      });
    }
  };
})();
