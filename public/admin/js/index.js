// Wait for Decap CMS to be available, then register custom preview
function waitForCMS(callback, attempts = 0) {
  if (window.CMS) {
    callback();
  } else if (attempts < 50) {
    setTimeout(() => waitForCMS(callback, attempts + 1), 100);
  } else {
    console.error('Decap CMS failed to load after 5 seconds');
  }
}

waitForCMS(() => {
  console.log('Decap CMS loaded, registering preview template');
  
  const { h, createClass } = window;
  const { getPastForms, getFutureForms, getImperativeForms, persons } = window.VerbGrammar;

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
        imperative: entry.getIn(["data", "conjugation", "imperative"])?.toJS(),
      },
    };
  };

  const personLabels = {
    ikh: "איך (I)",
    du: "דו (you sg)",
    er_zi_es: "ער/זי/עס (he/she/it)",
    mir: "מיר (we)",
    ir: "איר (you pl)",
    zey: "זיי (they)",
  };

  const renderPersonEntry = (label, form) => {
    return h(
      "li",
      { style: { marginBottom: 6 } },
      h("div", { style: { fontWeight: 600 } }, label),
      h("div", {}, "Yiddish: ", form.yiddish),
      h("div", { style: { color: "#555" } }, "Transliteration: ", form.transliteration)
    );
  };

  const renderForms = (title, forms) => {
    if (!forms) return null;
    return h(
      "div",
      { style: { border: "1px solid #ddd", borderRadius: 6, padding: 12, marginBottom: 12 } },
      h("h3", { style: { margin: "0 0 8px" } }, title),
      h(
        "ul",
        { style: { listStyle: "none", padding: 0, margin: 0 } },
        persons.map((p) => {
          const f = forms[p];
          return f ? renderPersonEntry(personLabels[p] || p, f) : null;
        })
      )
    );
  };

  const VerbPreview = createClass({
    render: function() {
      const verb = getVerbFromEntry(this.props.entry);
      const past = getPastForms(verb);
      const future = getFutureForms(verb);
      const imp = getImperativeForms(verb);

      return h(
        "div",
        { style: { fontFamily: "Arial, sans-serif", lineHeight: 1.4, padding: 16 } },
        h("h1", { style: { margin: 0 } }, verb.lemma.yiddish, " ", verb.reflexive ? "זיך" : ""),
        h("div", { style: { color: "#444", marginBottom: 8 } }, 
          "(", verb.lemma.transliteration, verb.reflexive ? " zikh" : "", ")"
        ),
        verb.meaning?.english && h(
          "div",
          { style: { marginBottom: 16 } },
          h("strong", {}, "Meaning:"),
          " ", verb.meaning.english
        ),
        renderForms("Present", verb.conjugation.present),
        renderForms("Past", past),
        renderForms("Future", future),
        imp && h(
          "div",
          { style: { border: "1px solid #ddd", borderRadius: 6, padding: 12 } },
          h("h3", { style: { margin: "0 0 8px" } }, "Imperative"),
          h(
            "ul",
            { style: { listStyle: "none", padding: 0, margin: 0 } },
            imp.du && renderPersonEntry("singular", imp.du),
            imp.ir && renderPersonEntry("plural", imp.ir)
          )
        )
      );
    }
  });

  console.log("Registering VerbPreview template");
  window.CMS.registerPreviewTemplate("verbs", VerbPreview);
});