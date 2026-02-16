import fs from "fs";
import yaml from "js-yaml";

const API = "https://en.wiktionary.org/w/api.php";

async function fetchWikitext(title) {
  const url = `${API}?action=query&titles=${encodeURIComponent(
    title
  )}&prop=revisions&rvprop=content&format=json&formatversion=2`;

  const res = await fetch(url);
  const data = await res.json();
  const pages = data.query.pages;
  if (!pages || pages.length === 0 || !pages[0].revisions) {
    throw new Error(`Verb "${title}" not found on Wiktionary`);
  }
  return pages[0].revisions[0].content;
}

async function fetchRenderedPage(title) {
  const url = `${API}?action=parse&page=${encodeURIComponent(title)}&prop=text&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  
  // Get the rendered HTML content
  const html = data.parse?.text?.["*"];
  
  if (!html) {
    throw new Error("Failed to parse page");
  }
  
  return html;
}

function extractGloss(wikitext) {
  // Look for # [[definition]] format
  const match = wikitext.match(/#\s+(?:To\s+)?(?:\[\[)?([^\]]+)/i);
  if (match) {
    return match[1].replace(/\[\[|\]\]/g, "").trim();
  }
  return null;
}

// Parse the HTML table from expanded yi-conj template
function parseConjugationTable(html) {
  const present = {};
  let pastParticiple = null;
  let infinitiveTr = null;
  let auxiliary = null;

  // Extract infinitive transliteration from <small> tag
  const infMatch = html.match(/infinitive[\s\S]{0,200}?<small>([^<]+)<\/small>/i);
  if (infMatch) {
    infinitiveTr = infMatch[1].trim();
  }

  // Extract past participle - both form and transliteration
  const ppMatch = html.match(/past participle[\s\S]{0,300}?>([\u0590-\u05FF]+)<[\s\S]{0,100}?<small>([^<]+)<\/small>/i);
  if (ppMatch) {
    pastParticiple = {
      yiddish: ppMatch[1].trim(),
      transliteration: ppMatch[2].trim(),
    };
  }

  // Extract auxiliary from table
  const auxMatch = html.match(/auxiliary[\s\S]{0,200}?<small>([^<]+)<\/small>/i);
  if (auxMatch) {
    const auxTr = auxMatch[1].trim().toLowerCase();
    auxiliary = auxTr.includes("zayn") ? "zayn" : "hobn";
  }

  // Find all <small> tags with their positions
  let match;
  const smallRegex = /<small>([^<]+)<\/small>/g;
  const personData = {};
  
  while ((match = smallRegex.exec(html)) !== null) {
    const content = match[1].trim();
    const parts = content.split(/\s+/);
    
    if (parts.length >= 2) {
      const person = parts[0];
      const transliteration = parts.slice(1).join(' ');
      
      if (["ikh", "du", "er", "mir", "ir", "zey"].includes(person)) {
        // Find the Yiddish form before this <small> tag
        const smallIndex = match.index;
        const precedingHtml = html.slice(Math.max(0, smallIndex - 300), smallIndex);
        // Match Hebrew characters and words separated by spaces
        const yiddishMatch = precedingHtml.match(/([\u0590-\u05FF]+(?:\s+[\u0590-\u05FF]+)*)\s*(?:<\/[^>]*>)*\s*(?:<[^>]*>)*\s*$/);
        
        if (yiddishMatch) {
          const personKey = person === "er" ? "er_zi_es" : person;
          if (!personData[personKey]) { // Only add if not already present
            personData[personKey] = {
              yiddish: yiddishMatch[1],
              transliteration,
            };
          }
        }
      }
    }
  }

  // Reorder to standard grammatical order
  const personOrder = ["ikh", "du", "er_zi_es", "mir", "ir", "zey"];
  for (const person of personOrder) {
    if (personData[person]) {
      present[person] = personData[person];
    }
  }

  return { present, pastParticiple, infinitiveTr, auxiliary };
}

// Generate conjugation for regular verbs using standard patterns
function generateConjugation(infinitiveHeb, infinitiveTr) {
  const presentBase = infinitiveHeb.slice(0, -1); // Remove ן
  const presentBaseTr = infinitiveTr.slice(0, -1);

  return {
    present: {
      ikh: {
        yiddish: presentBase,
        transliteration: presentBaseTr,
      },
      du: {
        yiddish: presentBase + "סט",
        transliteration: presentBaseTr + "st",
      },
      er_zi_es: {
        yiddish: presentBase + "ט",
        transliteration: presentBaseTr + "t",
      },
      mir: {
        yiddish: infinitiveHeb,
        transliteration: infinitiveTr,
      },
      ir: {
        yiddish: presentBase + "ט",
        transliteration: presentBaseTr + "t",
      },
      zey: {
        yiddish: infinitiveHeb,
        transliteration: infinitiveTr,
      },
    },
    pastParticiple: {
      yiddish: "ג" + "ע" + presentBase + "ט",
      transliteration: "ge" + presentBaseTr + "t",
    },
  };
}

function extractAuxiliary(html) {
  // Check if verb uses "zayn" auxiliary (זײַן)
  return html.includes("זײַן") || html.includes("zayn") ? "zayn" : "hobn";
}

async function generateVerb(title) {
  console.log(`Fetching verb "${title}" from Wiktionary...`);
  
  const wikitext = await fetchWikitext(title);

  const gloss = extractGloss(wikitext);
  if (!gloss) throw new Error("Could not extract gloss (definition) from Wiktionary");

  // Fetch the rendered page to get the conjugation table
  const html = await fetchRenderedPage(title);
  const { present, pastParticiple, infinitiveTr, auxiliary } = parseConjugationTable(html);

  // If table extraction didn't find auxiliary, fall back to wikitext check
  const finalAuxiliary = auxiliary || extractAuxiliary(wikitext);

  // If table was empty, generate conjugations from stem
  let conjugation;
  let finalInfinitiveTr;
  
  if (Object.keys(present).length === 0) {
    // Fallback: generate from stem (this shouldn't happen if Wiktionary has data)
    console.warn("Warning: Could not extract conjugations from Wiktionary, using defaults");
    conjugation = generateConjugation(title, infinitiveTr || title);
    finalInfinitiveTr = infinitiveTr || title;
  } else {
    conjugation = { present, pastParticiple };
    // Use infinitive transliteration from the table
    finalInfinitiveTr = infinitiveTr || present.mir?.transliteration || present.ikh?.transliteration || title;
  }

  const id = finalInfinitiveTr.replace(/\s+/g, "-");
  
  const output = {
    id: id,
    categoryId: "simple",
    lemma: {
      yiddish: title,
      transliteration: finalInfinitiveTr,
    },
    meaning: {
      english: `to ${gloss}`,
    },
    auxiliary: finalAuxiliary,
    conjugation: {
      present: conjugation.present,
      past_participle: conjugation.pastParticiple,
    },
    search: {
      yiddish: [],
      transliteration: [],
      english: [],
    },
  };

  const outputDir = "./content/verbs";
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filename = finalInfinitiveTr.replace(/\s+/g, "-");
  fs.writeFileSync(
    `${outputDir}/${filename}.yml`,
    yaml.dump(output, { allowUnicode: true })
  );

  console.log(`✓ Generated ${filename}.yml`);
  console.log(`  Definition: to ${gloss}`);
  console.log(`  Auxiliary: ${finalAuxiliary}`);
  console.log(`  Past participle: ${conjugation.pastParticiple.yiddish}`);
}

const yiddishWord = process.argv[2];
if (!yiddishWord) {
  console.error("Usage: npm run fetch:verb <yiddish-word>");
  console.error("Example: npm run fetch:verb שיקן");
  process.exit(1);
}

generateVerb(yiddishWord).catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});