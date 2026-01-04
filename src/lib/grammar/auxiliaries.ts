import { Person, VerbForm } from '@/types/verb';

export const auxiliaries: Record<
  'zayn' | 'hobn',
  Record<Person, VerbForm>
> = {
  zayn: {
    ikh: { yiddish: 'בין', transliteration: 'bin' },
    du: { yiddish: 'ביסט', transliteration: 'bist' },
    er_zi_es: { yiddish: 'איז', transliteration: 'iz' },
    mir: { yiddish: 'זײַנען', transliteration: 'zaynen' },
    ir: { yiddish: 'זײַט', transliteration: 'zayt' },
    zey: { yiddish: 'זײַנען', transliteration: 'zaynen' },
  },
  hobn: {
    ikh: { yiddish: 'האָב', transliteration: 'hob' },
    du: { yiddish: 'האַסט', transliteration: 'hast' },
    er_zi_es: { yiddish: 'האָט', transliteration: 'hot' },
    mir: { yiddish: 'האָבן', transliteration: 'hobn' },
    ir: { yiddish: 'האָט', transliteration: 'hot' },
    zey: { yiddish: 'האָבן', transliteration: 'hobn' },
  },
};
