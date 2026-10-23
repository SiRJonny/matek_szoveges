# Szöveges matematika – alsó tagozat (1–4. osztály)

Nyomtatható szöveges matematika feladatcsomag GitHub Pageshez. Statikus weboldal: sima HTML/CSS/JS, build és szerver nélkül.

## Mit tud?

- **24 szöveges feladat**, **8 megoldási minta** szerint csoportosítva (pl. `x = A + (A + B)`, `x = P − A × B`).
- **Nyomtatási nézet:** 1. oldal = feladatlap, 2. oldal = megoldókulcs (új nyomtatott oldal).
- **Véletlenszerű számok:** kattints bármelyik feladatra (vagy a kulcs megfelelő sorára) — új számok és új eredmény. A „🎲 Új számok minden feladathoz” gomb mindent egyszerre kever.
- A „Megoldókulcs elrejtése” gombbal csak a feladatlapot nyomtathatod ki.
- Minden a böngészőben fut (`Math.random`), adat nem tárolódik.

## Feladatcsoportok

| Megoldási minta | Témakör | Osztály |
|---|---|---|
| `x = A + B` | Két adat összege | 1. |
| `x = A − B` | Elvétel: mennyi maradt | 1. |
| `x = B − A` | Hiányzó rész kiegészítése | 1–2. |
| `x = A + (A + B)` | Együtt, ha az egyiknek több van | 2. |
| `x = A × B` | Egyforma csoportok – szorzás | 2–3. |
| `x = A ÷ B` | Egyenlő szétosztás – osztás | 2–3. |
| `x = P − A × B` | Vásárlás – visszajáró | 3–4. |
| `x = (A + B) ÷ C` | Összeszedve, szétosztva | 3–4. |

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

A `js/data.js` fájlban minden feladat egy generátor: a `build()` függvény sorsolja a számokat és adja vissza a szöveget (`text`) és a megoldási lépést (`work`). Új feladat például:

```js
{
  id: "uj-feladat",
  build: () => {
    const a = ri(2, 9), b = ri(2, 9);
    return {
      text: `Anna ${a} szendvicset vitt, Peti ${b} szendvicset. Hány szendvics lett összesen?`,
      work: `${a} + ${b} = ${a + b} szendvics`,
    };
  },
}
```

Új csoportként másold egyik meglévő `GROUPS` bejegyzést, és írd át a `title`, `formula`, `grade`, `hint` mezőket.
