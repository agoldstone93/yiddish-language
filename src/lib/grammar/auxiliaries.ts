import { Person, VerbForm } from '@/types/verb';

export const auxiliaries: Record<
  'zayn' | 'hobn',
  Record<Person, VerbForm>
> = {
  zayn: {
    ich: { yiddish: 'בין', transliteration: 'bin' },
    du: { yiddish: 'ביסט', transliteration: 'bist' },
    er_zi_es: { yiddish: 'איז', transliteration: 'iz' },
    mir: { yiddish: 'זענען', transliteration: 'zenen' },
    ir: { yiddish: 'זייט', transliteration: 'zayt' },
    zey: { yiddish: 'זענען', transliteration: 'zenen' },
  },
  hobn: {
    ich: { yiddish: 'האָב', transliteration: 'hob' },
    du: { yiddish: 'האַסט', transliteration: 'hast' },
    er_zi_es: { yiddish: 'האָט', transliteration: 'hot' },
    mir: { yiddish: 'האָבן', transliteration: 'hobn' },
    ir: { yiddish: 'האָט', transliteration: 'hot' },
    zey: { yiddish: 'האָבן', transliteration: 'hobn' },
  },
};
