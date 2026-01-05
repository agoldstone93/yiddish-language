// Browser entry point for grammar functions
// This file is compiled to public/admin/js/grammar.js for use in CMS preview

import { getPastForms } from './past';
import { getFutureForms, velnPresent } from './future';
import { getConditionalForms, voltPresent } from './conditional';
import { getImperativeForms } from './imperative';
import { auxiliaries } from './auxiliaries';
import type { Person } from '@/types/verb';

const persons: Person[] = ["ikh", "du", "er_zi_es", "mir", "ir", "zey"];

// Expose to window for CMS preview
declare global {
  interface Window {
    VerbGrammar: {
      auxiliaries: typeof auxiliaries;
      voltPresent: typeof voltPresent;
      velnPresent: typeof velnPresent;
      persons: typeof persons;
      getPastForms: typeof getPastForms;
      getFutureForms: typeof getFutureForms;
      getConditionalForms: typeof getConditionalForms;
      getImperativeForms: typeof getImperativeForms;
    };
  }
}

window.VerbGrammar = {
  auxiliaries,
  voltPresent,
  velnPresent,
  persons,
  getPastForms,
  getFutureForms,
  getConditionalForms,
  getImperativeForms,
};
