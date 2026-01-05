"use strict";
(() => {
  // src/lib/grammar/auxiliaries.ts
  var auxiliaries = {
    zayn: {
      ikh: { yiddish: "\u05D1\u05D9\u05DF", transliteration: "bin" },
      du: { yiddish: "\u05D1\u05D9\u05E1\u05D8", transliteration: "bist" },
      er_zi_es: { yiddish: "\u05D0\u05D9\u05D6", transliteration: "iz" },
      mir: { yiddish: "\u05D6\u05F2\u05B7\u05E0\u05E2\u05DF", transliteration: "zaynen" },
      ir: { yiddish: "\u05D6\u05F2\u05B7\u05D8", transliteration: "zayt" },
      zey: { yiddish: "\u05D6\u05F2\u05B7\u05E0\u05E2\u05DF", transliteration: "zaynen" }
    },
    hobn: {
      ikh: { yiddish: "\u05D4\u05D0\u05B8\u05D1", transliteration: "hob" },
      du: { yiddish: "\u05D4\u05D0\u05B8\u05E1\u05D8", transliteration: "host" },
      er_zi_es: { yiddish: "\u05D4\u05D0\u05B8\u05D8", transliteration: "hot" },
      mir: { yiddish: "\u05D4\u05D0\u05B8\u05D1\u05DF", transliteration: "hobn" },
      ir: { yiddish: "\u05D4\u05D0\u05B8\u05D8", transliteration: "hot" },
      zey: { yiddish: "\u05D4\u05D0\u05B8\u05D1\u05DF", transliteration: "hobn" }
    }
  };

  // src/lib/grammar/past.ts
  function getPastForms(verb) {
    if (!verb.conjugation) return null;
    const pp = verb.conjugation.past_participle;
    if (!pp) return null;
    const aux = auxiliaries[verb.auxiliary];
    const result = {};
    Object.keys(aux).forEach((person) => {
      const yiddishZikh = verb.reflexive ? " \u05D6\u05D9\u05DA" : "";
      const transliterationZikh = verb.reflexive ? " zikh" : "";
      const ppYiddish = verb.reflexive ? pp.yiddish.replace(/\s?זיך$/, "") : pp.yiddish;
      const ppTranslit = verb.reflexive ? pp.transliteration.replace(/\s?zikh$/, "") : pp.transliteration;
      result[person] = {
        yiddish: `${aux[person].yiddish}${yiddishZikh} ${ppYiddish}`,
        transliteration: `${aux[person].transliteration}${transliterationZikh} ${ppTranslit}`
      };
    });
    return result;
  }

  // src/lib/grammar/future.ts
  var velnPresent = {
    ikh: { yiddish: "\u05D5\u05D5\u05E2\u05DC", transliteration: "vel" },
    du: { yiddish: "\u05D5\u05D5\u05E2\u05E1\u05D8", transliteration: "vest" },
    er_zi_es: { yiddish: "\u05D5\u05D5\u05E2\u05D8", transliteration: "vet" },
    mir: { yiddish: "\u05D5\u05D5\u05E2\u05DC\u05DF", transliteration: "veln" },
    ir: { yiddish: "\u05D5\u05D5\u05E2\u05D8", transliteration: "vet" },
    zey: { yiddish: "\u05D5\u05D5\u05E2\u05DC\u05DF", transliteration: "veln" }
  };
  function getFutureForms(verb) {
    const result = {};
    Object.keys(velnPresent).forEach((person) => {
      let lemmaYiddish = verb.lemma.yiddish;
      let lemmaTranslit = verb.lemma.transliteration;
      if (verb.reflexive && lemmaYiddish.includes(" \u05D6\u05D9\u05DA")) {
        lemmaYiddish = lemmaYiddish.replace(" \u05D6\u05D9\u05DA", "");
        lemmaTranslit = lemmaTranslit.replace(" zikh", "");
      }
      const yiddishZikh = verb.reflexive ? " \u05D6\u05D9\u05DA" : "";
      const transliterationZikh = verb.reflexive ? " zikh" : "";
      result[person] = {
        yiddish: `${velnPresent[person].yiddish}${yiddishZikh} ${lemmaYiddish}`,
        transliteration: `${velnPresent[person].transliteration}${transliterationZikh} ${lemmaTranslit}`
      };
    });
    return result;
  }

  // src/lib/grammar/conditional.ts
  var voltPresent = {
    ikh: { yiddish: "\u05D5\u05D5\u05D0\u05B8\u05DC\u05D8", transliteration: "volt" },
    du: { yiddish: "\u05D5\u05D5\u05D0\u05B8\u05DC\u05D8\u05E1\u05D8", transliteration: "voltst" },
    er_zi_es: { yiddish: "\u05D5\u05D5\u05D0\u05B8\u05DC\u05D8", transliteration: "volt" },
    mir: { yiddish: "\u05D5\u05D5\u05D0\u05B8\u05DC\u05D8\u05DF", transliteration: "voltn" },
    ir: { yiddish: "\u05D5\u05D5\u05D0\u05B8\u05DC\u05D8", transliteration: "volt" },
    zey: { yiddish: "\u05D5\u05D5\u05D0\u05B8\u05DC\u05D8\u05DF", transliteration: "voltn" }
  };
  function getConditionalForms(verb) {
    if (!verb.conjugation) return null;
    const pp = verb.conjugation.past_participle;
    if (!pp) return null;
    const result = {};
    Object.keys(voltPresent).forEach((person) => {
      const yiddishZikh = verb.reflexive ? " \u05D6\u05D9\u05DA" : "";
      const transliterationZikh = verb.reflexive ? " zikh" : "";
      const ppYiddish = verb.reflexive ? pp.yiddish.replace(/\s?זיך$/, "") : pp.yiddish;
      const ppTranslit = verb.reflexive ? pp.transliteration.replace(/\s?zikh$/, "") : pp.transliteration;
      result[person] = {
        yiddish: `${voltPresent[person].yiddish}${yiddishZikh} ${ppYiddish}`,
        transliteration: `${voltPresent[person].transliteration}${transliterationZikh} ${ppTranslit}`
      };
    });
    return result;
  }

  // src/lib/grammar/imperative.ts
  function getImperativeForms(verb) {
    if (!verb.conjugation) return null;
    if (verb.conjugation.imperative) {
      return verb.conjugation.imperative;
    }
    const { present } = verb.conjugation;
    if (!present?.ikh || !present.ir) return null;
    return {
      du: present.ikh,
      ir: present.ir
    };
  }

  // src/lib/grammar/browser.ts
  var persons = ["ikh", "du", "er_zi_es", "mir", "ir", "zey"];
  window.VerbGrammar = {
    auxiliaries,
    voltPresent,
    velnPresent,
    persons,
    getPastForms,
    getFutureForms,
    getConditionalForms,
    getImperativeForms
  };
})();
//# sourceMappingURL=grammar.js.map
