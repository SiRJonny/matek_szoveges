# matek_szoveges — magyar szöveges matekfeladat-generátor

## Cél
Véletlenszerű magyar szöveges matekfeladatok generálása. Koncsol prototípussal indul,
később GitHub Pages weboldal belőle.

## Alapötlet (hogyan lehet randomizálni)
Minden feladattípus = **matematikai modell (formula) + szöveg-sablonok (slotokkal)**.

Példa a felhasználó példájára:
- Formula: `x = A + (A + B)`  → nota: "olvas-olvas" minta
- Szöveg: `{N1} {A} oldalt olvasott el, {N2} {B} oldallal többet. Hány oldalt olvastak el összesen?`
- Számok: A, B random értelmezhető tartományból
- Nevek, egységek (oldal, cserép, sticker, labda, forint) random szókészletből

Ez válaszol arra, hogy "hogyan automatizálható":
a **formulát fixen tartjuk, a szöveget slotokból rakjuk össze**,
a számokat a formula (és a valósághűség) korlátozza.
Később: fordított változat (ismeretlen a B lesz a kérdés), hiányos/felesleges adat,
több lépéses modellek — a struktúra már ezt készíti elő.

## Struktúra (prototípus)
```
lib/rng.js        # random segédek (int, pick, shuffle)
lib/name.js       # nevek és életteli egységek szókészlete
templates/        # feladattípusok: formula + magyar szöveg-sablonok
gen.js            # konzol CLI
```

## Fázis 0 — konzol prototípus (most)
- `gen.js`:
  - alap mód: quiz — feladat kiírás, válasz beírás, ellenőrzés
  - `--print`: csak kiírja feladat + megoldás (gyors teszt)
  - `--only <típus>`: csak egy feladattípus

Futtatás:
```
node gen.js 10          # quiz mód, 10 feladat
node gen.js 5 --print   # csak kiírás
node gen.js --only olvasas
```

## Kezdeti feladattípusok (limited options)
1. `A + (A + B)` — az eredeti minta
2. `A + 2B` — zsebpénz / pékség
3. `A - 2B` — fordított irány (mennyi maradt?)
   (`A + B` triviális, kihagyjuk; fordított változat a struktúra miatt olcsó betenni)

## Magyarnyelvi szempontok
- Szám után raggazott minta template-be kódolva (oldalt, oldallal, forint, forintot…)
- Nevek magyaros: Eszter, János, Peti, Zsófi, Marci, Bora, …
- Értékek realisztikus tartományban (pl. olvassás: 50–200 oldal)

## Fázis 1 — weboldal (később)
- Ugyanaz a lib + templates, böngészőben (semmit nem kell újraírni, csak UI jön)
- Generátor gombok, pontozás, nehézségi szintek
- GitHub Pages: statikus deployment
