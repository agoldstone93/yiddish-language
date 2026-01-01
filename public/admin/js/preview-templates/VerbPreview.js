// Use React from global scope (provided by Decap CMS)
const React = window.React;

// Minimal helpers mirroring the site logic to show derived forms in the CMS preview
const auxiliaries = {
  zayn: {
    ich: { yiddish: "בין", transliteration: "bin" },
    du: { yiddish: "ביסט", transliteration: "bist" },
    er_zi_es: { yiddish: "איז", transliteration: "iz" },
    mir: { yiddish: "זײַנען", transliteration: "zaynen" },
    ir: { yiddish: "זײַט", transliteration: "zayt" },
    zey: { yiddish: "זײַנען", transliteration: "zaynen" },
  },
  hobn: {
    ich: { yiddish: "האָב", transliteration: "hob" },
    du: { yiddish: "האַסט", transliteration: "hast" },
    er_zi_es: { yiddish: "האָט", transliteration: "hot" },
    mir: { yiddish: "האָבן", transliteration: "hobn" },
    ir: { yiddish: "האָט", transliteration: "hot" },
    zey: { yiddish: "האָבן", transliteration: "hobn" },
  },
};

const velnPresent = {
  ich: { yiddish: "וועל", transliteration: "vel" },
  du: { yiddish: "וועסט", transliteration: "vest" },
  er_zi_es: { yiddish: "וועט", transliteration: "vet" },
  mir: { yiddish: "וועלן", transliteration: "veln" },
  ir: { yiddish: "וועט", transliteration: "vet" },
  zey: { yiddish: "וועלן", transliteration: "veln" },
};

const persons = ["ich", "du", "er_zi_es", "mir", "ir", "zey"];

const getPastForms = (verb) => {
  const pp = verb?.conjugation?.past_participle;
  if (!pp) return null;
  const aux = auxiliaries[verb.auxiliary];
  if (!aux) return null;

  const ppYid = verb.reflexive ? pp.yiddish?.replace(/\s?זיך$/, "") : pp.yiddish;
  const ppTranslit = verb.reflexive ? pp.transliteration?.replace(/\s?zikh$/, "") : pp.transliteration;

  const zikhY = verb.reflexive ? " זיך" : "";
  const zikhT = verb.reflexive ? " zikh" : "";

  const result = {};
  persons.forEach((p) => {
    result[p] = {
      yiddish: `${aux[p].yiddish}${zikhY} ${ppYid ?? ""}`.trim(),
      transliteration: `${aux[p].transliteration}${zikhT} ${ppTranslit ?? ""}`.trim(),
    };
  });
  return result;
};

const getFutureForms = (verb) => {
  const result = {};
  persons.forEach((p) => {
    let lemmaY = verb.lemma?.yiddish || "";
    let lemmaT = verb.lemma?.transliteration || "";
    if (verb.reflexive && lemmaY.includes(" זיך")) {
      lemmaY = lemmaY.replace(" זיך", "");
      lemmaT = lemmaT.replace(" zikh", "");
    }
    const zikhY = verb.reflexive ? " זיך" : "";
    const zikhT = verb.reflexive ? " zikh" : "";
    result[p] = {
      yiddish: `${velnPresent[p].yiddish}${zikhY} ${lemmaY}`.trim(),
      transliteration: `${velnPresent[p].transliteration}${zikhT} ${lemmaT}`.trim(),
    };
  });
  return result;
};

const getImperativeForms = (verb) => {
  const imp = verb?.conjugation?.imperative;
  if (imp) return imp;
  const present = verb?.conjugation?.present;
  if (!present?.ich || !present?.ir) return null;
  return { du: present.ich, ir: present.ir };
};

const getVerbFromEntry = (entry) => {
  const get = (path) => entry.getIn(["data", ...path]);
  const present = persons.reduce((acc, p) => {
    const y = get(["conjugation", "present", p, "yiddish"]);
    const t = get(["conjugation", "present", p, "transliteration"]);
    if (y || t) acc[p] = { yiddish: y, transliteration: t };
    return acc;
  }, {});

  return {
    id: get(["id"]),
    reflexive: !!get(["reflexive"]),
    auxiliary: get(["auxiliary"]) || "hobn",
    lemma: {
      yiddish: get(["lemma", "yiddish"]) || "",
      transliteration: get(["lemma", "transliteration"]) || "",
    },
    meaning: {
      english: get(["meaning", "english"]) || "",
    },
    conjugation: {
      present,
      past_participle: {
        yiddish: get(["conjugation", "past_participle", "yiddish"]) || "",
        transliteration: get(["conjugation", "past_participle", "transliteration"]) || "",
      },
      imperative: entry.getIn(["data", "conjugation", "imperative"]),
    },
  };
};

const personLabels = {
  ich: "ich (I)",
  du: "du (you sg)",
  er_zi_es: "er / zi / es (he/she/it)",
  mir: "mir (we)",
  ir: "ir (you pl)",
  zey: "zey (they)",
};

const renderForms = (title, forms) => {
  if (!forms) return null;
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 6, padding: 12, marginBottom: 12 }}>
      <h3 style={{ margin: "0 0 8px" }}>{title}</h3>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {persons.map((p) => {
          const f = forms[p];
          if (!f) return null;
          return (
            <li key={p} style={{ marginBottom: 6 }}>
              <div style={{ fontWeight: 600 }}>{personLabels[p] || p}</div>
              <div>Yiddish: {f.yiddish}</div>
              <div style={{ color: "#555" }}>Transliteration: {f.transliteration}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const VerbPreview = ({ entry }) => {
  const verb = getVerbFromEntry(entry);

  const past = getPastForms(verb);
  const future = getFutureForms(verb);
  const imp = getImperativeForms(verb);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: 1.4, padding: 16 }}>
      <h1 style={{ margin: 0 }}>{verb.lemma.yiddish} {verb.reflexive ? "זיך" : ""}</h1>
      <div style={{ color: "#444", marginBottom: 8 }}>
        ({verb.lemma.transliteration}{verb.reflexive ? " zikh" : ""})
      </div>
      {verb.meaning?.english && (
        <div style={{ marginBottom: 16 }}><strong>Meaning:</strong> {verb.meaning.english}</div>
      )}

      {renderForms("Present", verb.conjugation.present)}
      {renderForms("Past", past)}
      {renderForms("Future", future)}
      {imp && (
        <div style={{ border: "1px solid #ddd", borderRadius: 6, padding: 12 }}>
          <h3 style={{ margin: "0 0 8px" }}>Imperative</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {imp.du && (
              <li style={{ marginBottom: 6 }}>
                <div style={{ fontWeight: 600 }}>du (singular)</div>
                <div>Yiddish: {imp.du.yiddish}</div>
                <div style={{ color: "#555" }}>Transliteration: {imp.du.transliteration}</div>
              </li>
            )}
            {imp.ir && (
              <li style={{ marginBottom: 0 }}>
                <div style={{ fontWeight: 600 }}>ir (plural)</div>
                <div>Yiddish: {imp.ir.yiddish}</div>
                <div style={{ color: "#555" }}>Transliteration: {imp.ir.transliteration}</div>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VerbPreview;