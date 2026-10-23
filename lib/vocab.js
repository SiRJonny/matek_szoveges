// Szókészlet: magyar keresztnevek + tárgyi egységek nyelvtani alakokkal.
// Minden szöveg-sablon ezekből válogat, így a feladat szövege is randomizálódik,
// de a magyar ragok helyesek maradnak (minden alak kézzel kódolt).

export const NEVEK = [
  'Eszter', 'János', 'Peti', 'Zsófi', 'Marci', 'Bori',
  'Anna', 'Dani', 'Kata', 'Gergő', 'Cili', 'Nóra',
];

/**
 * Egység + tevékenység minták az `A + (A + B)` típushoz.
 * Minden minta magában hordozza a helyes raggazott alakokat.
 */
export const GYUJTELMENY_MINTAK = [
  {
    unit: 'oldal',
    szoveg: (n1, a, n2, b) =>
      `${n1} ${a} oldalt olvasott el, ${n2} ${b} oldallal többet.`,
    kerdes: (n1, n2) => `Hány oldalt olvastak el összesen?`,
    egységSzo: 'oldal', // a megoldás-szövegben: "290 oldal"
  },
  {
    unit: 'matrica',
    szoveg: (n1, a, n2, b) =>
      `${n1} ${a} matricát gyűjtött, ${n2} ${b} matricával többet.`,
    kerdes: () => `Hány matricát gyűjtöttek összesen?`,
    egységSzo: 'matrica',
  },
  {
    unit: 'korong',
    szoveg: (n1, a, n2, b) =>
      `${n1} ${a} korongot szerzett, ${n2} ${b} koronggal többet.`,
    kerdes: () => `Hány korongot szerzettek összesen?`,
    egységSzo: 'korong',
  },
  {
    unit: 'mogyoró',
    szoveg: (n1, a, n2, b) =>
      `${n1} ${a} mogyorót szedett, ${n2} ${b} mogyoróval többet.`,
    kerdes: () => `Hány mogyorót szedtek összesen?`,
    egységSzo: 'mogyoró',
  },
];

/** Tipikus értéktartományok (realizmus, magyar iskolai feladatokhoz hangolva). */
export const TAROMANYOK = {
  oldal: { a: [30, 150], b: [10, 70] },
  matrica: { a: [15, 80], b: [5, 40] },
  korong: { a: [10, 60], b: [3, 30] },
  mogyoro: { a: [10, 70], b: [5, 40] },
  penz: { a: [100, 1500], b: [50, 400] },
};
