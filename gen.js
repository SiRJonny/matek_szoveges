// matek_szoveges — konzol prototípus
//
// Használat:
//   node gen.js                 # quiz mód, 5 feladat
//   node gen.js 10              # quiz mód, 10 feladat
//   node gen.js 5 --print       # csak kiírás (feladat + megoldás)
//   node gen.js --only zsebpenz # egyetlen típus
//   node gen.js --seed 42       # megismételhető sorozat

import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { SABLONOK, makeRandom } from './templates/index.js';

// --- argumentumok ---
const args = process.argv.slice(2);
let count = 5;
let printMode = false;
let only = null;
let seedArg = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--print') printMode = true;
  else if (args[i] === '--only') only = args[++i];
  else if (args[i] === '--seed') seedArg = args[++i];
  else if (!isNaN(Number(args[i]))) count = Number(args[i]);
}

const rng = makeRandom(seedArg);
let sablonok = SABLONOK;
if (only) {
  sablonok = SABLONOK.filter((s) => s.id === only);
  if (sablonok.length === 0) {
    console.error(`Ismeretlen típus: ${only}\nLehetséges: ${SABLONOK.map((s) => s.id).join(', ')}`);
    process.exit(1);
  }
}

// --- feladatok legyártása ---
const feladatok = Array.from({ length: count }, () => {
  const sablon = rng.pick(sablonok);
  return sablon.generate(rng);
});

if (printMode) {
  feladatok.forEach((f, i) => {
    console.log(`\n${i + 1}. feladat   [${f.id}]  ${f.formula}   A=${f.A}, B=${f.B}`);
    console.log(`   ${f.szoveg}`);
    console.log(`   ➜ ${f.megoldas}`);
    console.log(`   ➜ ${f.valasz}`);
  });
  process.exit(0);
}

// --- quiz mód ---
if (input.isTTY === false) {
  console.error('Quiz mód interaktív terminált vár. Használj --print-et.');
  process.exit(1);
}

const rl = readline.createInterface({ input, output });
let pont = 0;

console.log('Szöveges matek quiz! Írd be a választ (szám), Enter. "m" = megoldás, "q" = kilépés.\n');

for (let i = 0; i < feladatok.length; i++) {
  const f = feladatok[i];
  console.log(`${i + 1}. ${f.szoveg}`);

  while (true) {
    const tipp = (await rl.question('Válaszod: ')).trim().replace(/\s/g, '');
    if (tipp.toLowerCase() === 'q') process.exit(0);
    if (tipp.toLowerCase() === 'm') {
      console.log(`   Megoldás: ${f.megoldas}\n   ${f.valasz}\n`);
      break;
    }
    const szam = Number(tipp);
    if (!Number.isFinite(szam)) {
      console.log('   Nem értelmezhető szám. Próbáld újra (vagy "m"/"q").');
      continue;
    }
    if (szam === f.helyes) {
      pont++;
      console.log('   ✅ Helyes!\n');
    } else {
      console.log(`   ❌ Nem jó. ${f.megoldas}\n   ${f.valasz}\n`);
    }
    break;
  }
}

console.log(`Vége! Pontszám: ${pont}/${feladatok.length}`);
rl.close();
