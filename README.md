# Szöveges matematika – alsó tagozat (1–4. osztály)

Nyomtatható szöveges matematika feladatcsomag GitHub Pageshez. Statikus weboldal: sima HTML/CSS/JS, build és szerver nélkül.

## Mit tud?

- **8 megoldási minta** csoport (pl. `x = A + (A + B)`, `x = P − A × B`), csoportonként **6 valódi szövegű feladat** — egyszerre **3 látszik**, a többi cserélhető.
- **Feladatonkénti gombok:**
  - **🔁 Új szöveg** — másik történetet hoz a csoport sablonkészletéből,
  - **🎲 Új számok** — ugyanahhoz a történethez sorsol új számokat,
  - **📋 Másolás** — a feladat szövegét a vágólapra teszi.
- **Megoldás a feladat mellett** látszik a képernyőn, a nyomtatási területen kívül; a kinyomtatott feladaton csak a számítás- és válaszó-sor marad.
- **Beállítások a bal oldalon:** operandus-tartomány (alap: 10–999) és eredmény-tartomány (alap: 0–999); a változtatás azonnal újrarendezi a feladatokat.
- **Negatív számok engedélyezése** (alap: ki) — bepipálva a „mennyi maradt” és a „visszajáró” típusú feladatok eredménye lehet negatív (tartozás).
- **Nyomtatásra optimalizált elrendezés:** 1. oldal = feladatlap, 2. oldal = megoldókulcs (új nyomtatott oldal).
- Minden a böngészőben fut (`Math.random`), adat nem tárolódik.

## Feladatcsoportok

| Megoldási minta | Témakör | Osztály | Sablonok |
|---|---|---|---|
| `x = A + B` | Két adat összege | 1. | 6 |
| `x = A − B` | Elvétel: mennyi maradt | 1. | 6 |
| `x = B − A` | Hiányzó rész kiegészítése | 1–2. | 6 |
| `x = A + (A + B)` | Együtt, ha az egyiknek több van | 2. | 6 |
| `x = A × B` | Egyforma csoportok – szorzás | 2–3. | 6 |
| `x = A ÷ B` | Egyenlő szétosztás – osztás | 2–3. | 6 |
| `x = P − A × B` | Vásárlás – visszajáró | 3–4. | 6 |
| `x = (A + B) ÷ C` | Összeszedve, szétosztva | 3–4. | 6 |

## Fájlstruktúra

```
index.html       — az oldal (feladatlap + megoldókulcs)
css/style.css    — téma + nyomtatási stílusok
js/data.js       — csoportok és feladatgenerátorok (ITT szerkeszthető)
js/app.js        — megjelenítés, randomizálás, nyomtatás gombok
```

## Előnézet helyben

Nyisd meg az `index.html` fájlt böngészőben, vagy futtass egyszerű szervert:

```bash
python -m http.server 8000
# http://localhost:8000
```

## Üzemeltetés GitHub Pagesen

1. Töltsd fel a mappát egy GitHub repóba (pl. `matek-szoveges`).
2. **Settings → Pages → Build and deployment → Source: Deploy from a branch.**
3. Válaszd a `main` branchet, mappa: `/ (root)`, majd **Save**.
4. Néhány perc múlva elérhető: `https://<felhasznalonev>.github.io/<repo-cím>/`.

Tipp: Ha a repó gyökerében van az `index.html`, nincs szükség további beállításra. A `.nojekyll` fájl biztosítja, hogy a GitHub ne próbáljon Jekyllt futtatni.

## Feladatok szerkesztése

A `js/data.js` fájlban 8 csoport van, csoportonként 6 sablonnal (`pool`). Minden sablon:

```js
{ id: "gesztenye", unit: "gesztenye",
  gen: (n) => ({ text: `Benedek ${n.a} gesztenyét talált... Hány gesztenyéje lett összesen?` }) },
```

A csoport `num(ctx)` függvénye sorsolja a számokat (`a`, `b`, `c`, `x` — a beállítások tartományai szerint), a `work(n, unit)` pedig a megoldási lépés szövegét készíti el. Új sablon például:

```js
{ id: "uj-sablon", unit: "szendvics",
  gen: (n) => ({ text: `Anna ${n.a} szendvicset vitt, Peti ${n.b} szendvicset. Hány szendvics lett összesen?` }) },
```

Új csoport másolásához a `num`, `work` és `pool` mezőket kell megadni — az új képlethez számmodellt kell írni a fájl elejére.
