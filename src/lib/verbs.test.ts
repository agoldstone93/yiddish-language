import { describe, expect, it } from 'vitest';

import { getAllVerbs } from './verbs';

describe('getAllVerbs', () => {
	it('loads YAML verbs from content/verbs', () => {
		const verbs = getAllVerbs();

		expect(verbs.length).toBeGreaterThan(0);

		for (const verb of verbs) {
			expect(verb.id).toBeTruthy();
			expect(verb.lemma?.yiddish).toBeTruthy();
			expect(verb.lemma?.transliteration).toBeTruthy();
			expect(verb.auxiliary === 'hobn' || verb.auxiliary === 'zayn').toBe(true);

			const present = verb.conjugation?.present;
			expect(present).toBeTruthy();

			for (const person of ['ich', 'du', 'er_zi_es', 'mir', 'ir', 'zey'] as const) {
				expect(present[person]?.yiddish).toBeTruthy();
				expect(present[person]?.transliteration).toBeTruthy();
			}
		}
	});
});
