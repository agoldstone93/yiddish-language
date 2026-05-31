// Normalise text for flexible matching across Yiddish/Hebrew and Latin inputs
export function normaliseForSearch(value: string | undefined | null): string {
  if (!value) return '';
  let text = value.normalize('NFD').toLowerCase();
  
  // Strip Hebrew cantillation + niqqud (U+0591–U+05C7)
  text = text.replace(/[\u0591-\u05C7]/g, '');
  
  // Normalise Yiddish ligatures to component letters
  // ײַ loses its patakh in the niqqud strip above, leaving ײ (U+05F2)
  text = text.replace(/\uFB1F|\u05F2/g, '\u05D9\u05D9'); // ײ / ײַ → יי
  text = text.replace(/\u05F0/g, '\u05D5\u05D5');         // װ → וו
  text = text.replace(/\u05F1/g, '\u05D5\u05D9');         // ױ → וי
  
  // Strip Latin combining marks
  text = text.replace(/[\u0300-\u036f]/g, '');
  
  // Map final Hebrew forms to standard forms
  text = text.replace(/[ךםןףץ]/g, (ch) => ({
    'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ',
  } as Record<string, string>)[ch] || ch);
  
  // Remove punctuation often used in Yiddish orthography and dashes/quotes
  text = text.replace(/[\u05BE\u05F3\u05F4\u2010-\u2015'"-]/g, '');
  
  // Collapse whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
}