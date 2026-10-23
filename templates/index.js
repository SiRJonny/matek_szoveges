// Feladattípusok. Mindegyik egy matematikai modell (formula) + magyar szöveg-sablon.
// A generate(rng) visszaad: szoveg, megoldas (lépéseket), valasz (kész mondat).

import { makeRandom } from '../lib/rng.js';
import { NEVEK, GYUJTELMENY_MINTAK, TAROMANYOK } from '../lib/vocab.js';

// Re-exportáljuk a makeRandom-ot, hogy a gen.js egy helyről húzzon.
export { makeRandom };

/**
 * 1) Formula: x = A + (A + B)
 * Két gyerek "gyűjt" valamit, a második B-vel többet. Összesen?
 */
const gyujtemenyTobb = {
  id: 'gyujtes-tobb',
  formula: 'x = A + (A + B)',
  generate(rng) {
    const minta = rng.pick(GYUJTELMENY_MINTAK);
    const t = TAROMANYOK[minta.unit === 'mogyoró' ? 'mogyoro' : minta.unit]
      || TAROMANYOK.oldal;
    const N1 = rng.pick(NEVEK);
    let N2 = rng.pick(NEVEK);
    while (N2 === N1) N2 = rng.pick(NEVEK);
    const A = rng.int(t.a[0], t.a[1]);
    const B = rng.int(t.b[0], t.b[1]);
    const masodik = A + B;
    const x = A + masodik;

    const szoveg =
      `${minta.szoveg(N1, A, N2, B)} ${minta.kerdes(N1, N2)}`;
    const megoldas =
      `${N1}: ${A}, ${N2}: ${A} + ${B} = ${masodik}. Összesen: ${A} + ${masodik} = ${x}.`;
    const valasz = `Összesen ${x} ${minta.egységSzo}.`;

    return { szoveg, megoldas, valasz, helyes: x, formula: this.formula, id: this.id, A, B };
  },
};

/**
 * 2) Formula: x = A + 2*B
 * Két változat: zsebpénz (2 hét) és vétel + ajándék.
 */
const zsebpenzHangyasz = {
  id: 'zsebpenz',
  formula: 'x = A + 2*B',
  generate(rng) {
    const N1 = rng.pick(NEVEK);
    const t = TAROMANYOK.penz;
    const A = rng.int(t.a[0], t.a[1]);
    const B = rng.int(t.b[0], t.b[1]);

    const valtozat = rng.pick(['zsebpenz', 'ajandek']);
    let szoveg, megoldas;

    if (valtozat === 'zsebpenz') {
      szoveg =
        `${N1} ${A} forintot kapott a nagyitól, utána 2 hétig minden héten ` +
        `${B} forint zsebpénzt kapott. Hány forint pénze lett összesen?`;
      megoldas =
        `Zsebpénz 2 hét alatt: 2 × ${B} = ${2 * B}. Összesen: ${A} + ${2 * B} = ${A + 2 * B}.`;
    } else {
      let N2 = rng.pick(NEVEK);
      while (N2 === N1) N2 = rng.pick(NEVEK);
      szoveg =
        `Egy toll ${B} forint. ${N1} vett 2 tollat, majd ${N2} adott neki ` +
        `${A} forintot. Mennyi forint pénze lett összesen?`;
      megoldas =
        `Tollak: 2 × ${B} = ${2 * B}. Összesen: ${A} + ${2 * B} = ${A + 2 * B}.`;
    }

    const x = A + 2 * B;
    const valasz = `Összesen ${x} forintja lett.`;
    return { szoveg, megoldas, valasz, helyes: x, formula: this.formula, id: this.id, A, B };
  },
};

/**
 * 3) Formula: x = A - 2*B  (fordított irány: mennyi maradt?)
 */
const vasarlasMaradt = {
  id: 'vasarlas-maradt',
  formula: 'x = A - 2*B',
  generate(rng) {
    const N1 = rng.pick(NEVEK);
    const t = TAROMANYOK.penz;
    // Ügyelünk, hogy a maradék pozitív és értelmes legyen: A > 2B
    const B = rng.int(50, 300);
    const A = rng.int(2 * B + 100, 2 * B + 900);
    const ar = 2 * B;
    const x = A - ar;
    const cucc = rng.pick([
      { termek: 'csomag gumicukrot' },
      { termek: 'tábla csokoládét' },
    ]);

    const szoveg =
      `${N1} ${A} forintja volt. Vett 2 ${cucc.termek}, ` +
      `mindegyik ${B} forintba került. Hány forintja maradt?`;
    const megoldas =
      `Költség: 2 × ${B} = ${ar}. Maradt: ${A} - ${ar} = ${x}.`;
    const valasz = `Maradt ${x} forintja.`;

    return { szoveg, megoldas, valasz, helyes: x, formula: this.formula, id: this.id, A, B };
  },
};

export const SABLONOK = [gyujtemenyTobb, zsebpenzHangyasz, vasarlasMaradt];
