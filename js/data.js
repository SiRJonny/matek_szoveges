"use strict";

/* Szöveges feladatok adatmodellje.
   Minden feladat generátor: véletlenszámokat sorsol, majd szöveget és
   megoldási lépést ad vissza. A csoportok megoldási logika szerint vannak
   rendezve (a fejlécben jelzett képlettel). */

const ri = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const GROUPS = [
  {
    title: "Két adat összege",
    formula: "x = A + B",
    grade: "1. osztály",
    hint: "Két adatot kell összeadni, a kérdés mindig az összegre kérdez.",
    exercises: [
      {
        id: "gesztenye",
        build: () => {
          const a = ri(2, 9), b = ri(2, 9), s = a + b;
          return {
            text: `Benedek ${a} gesztenyét talált a fűben, utána még ${b} gesztenyét szedett össze a játszótéren. Hány gesztenyéje lett összesen?`,
            work: `${a} + ${b} = ${s} gesztenye`,
          };
        },
      },
      {
        id: "viragok",
        build: () => {
          const a = ri(2, 9), b = ri(2, 9), s = a + b;
          return {
            text: `Luca ${a} piros és ${b} sárga virágot szedett a mezőn. Hány virágot szedett összesen?`,
            work: `${a} + ${b} = ${s} virág`,
          };
        },
      },
      {
        id: "ceruzak",
        build: () => {
          const a = ri(2, 9), b = ri(2, 9), s = a + b;
          return {
            text: `Botond ${a} ceruzát kapott a nagymamától és ${b} ceruzát a nagypapától. Hány ceruzája lett összesen?`,
            work: `${a} + ${b} = ${s} ceruza`,
          };
        },
      },
    ],
  },
  {
    title: "Elvétel: mennyi maradt",
    formula: "x = A − B",
    grade: "1. osztály",
    hint: "A kezdeti mennyiségből elveszünk valamennyit, a maradék a kivonás eredménye.",
    exercises: [
      {
        id: "golyok",
        build: () => {
          const a = ri(6, 19), b = ri(2, a - 1), r = a - b;
          return {
            text: `Hugó ${a} golyóval játszott a homokozóban, majd ${b} golyót odaadott a kishúgának. Hány golyója maradt?`,
            work: `${a} − ${b} = ${r} golyó`,
          };
        },
      },
      {
        id: "szilvak",
        build: () => {
          const a = ri(6, 19), b = ri(2, a - 1), r = a - b;
          return {
            text: `Réka ${a} szilvát vitt az iskolába, de útközben ${b} szilvát megevett. Hány szilvája maradt?`,
            work: `${a} − ${b} = ${r} szilva`,
          };
        },
      },
      {
        id: "lufik",
        build: () => {
          const a = ri(6, 19), b = ri(2, a - 1), r = a - b;
          return {
            text: `Péter ${a} lufit kapott a farsangi mulatságon, ${b} elszállt az ég felé. Hány lufija maradt?`,
            work: `${a} − ${b} = ${r} lufi`,
          };
        },
      },
    ],
  },
  {
    title: "Hiányzó rész kiegészítése",
    formula: "x = B − A   (A + x = B)",
    grade: "1–2. osztály",
    hint: "Valamennyi hiányzik az összeshez: az összesből kivonjuk a már meglévő részt.",
    exercises: [
      {
        id: "busz",
        build: () => {
          const b = ri(8, 28), a = ri(2, b - 1), d = b - a;
          return {
            text: `Az osztálykirándulásra ${b} gyerek regisztrált, ${a} gyerek már beült a buszba. Hány gyerek száll még be a buszba?`,
            work: `${b} − ${a} = ${d} gyerek`,
          };
        },
      },
      {
        id: "lanyok",
        build: () => {
          const b = ri(8, 30), a = ri(2, b - 1), d = b - a;
          return {
            text: `Az osztályban ${b} gyerek van, ${a} közülük fiú. Hány lány van az osztályban?`,
            work: `${b} − ${a} = ${d} lány`,
          };
        },
      },
      {
        id: "toll",
        build: () => {
          const b = 50 + 10 * ri(1, 43);
          const r = 10 * ri(1, Math.min(7, b / 10 - 1));
          const a = b - r;
          return {
            text: `Bianka egy ${b} forintos tollat akar venni, a zsebében ${a} forint van. Mennyi pénz hiányzik még a tollhoz?`,
            work: `${b} − ${a} = ${r} Ft`,
          };
        },
      },
    ],
  },
  {
    title: "Együtt, ha az egyiknek több van",
    formula: "x = A + (A + B)",
    grade: "2. osztály",
    hint: "Előbb kiszámoljuk a nagyobb mennyiséget (A + B), majd a kettő összegét.",
    exercises: [
      {
        id: "kisautok",
        build: () => {
          const a = ri(3, 12), b = ri(2, 9), s = 2 * a + b;
          return {
            text: `Zalánnak ${a} kisautója van, a kishúgának ${b}-vel több kisautója van. Hány kisautójuk van együtt?`,
            work: `${a} + (${a} + ${b}) = ${a} + ${a + b} = ${s} kisautó`,
          };
        },
      },
      {
        id: "gumicukor",
        build: () => {
          const a = ri(3, 12), b = ri(2, 9), s = 2 * a + b;
          return {
            text: `Levi ${a} gumicukrot evett a moziban, nővére ${b}-vel többet. Hány gumicukrot ettek együtt?`,
            work: `${a} + (${a} + ${b}) = ${a} + ${a + b} = ${s} gumicukor`,
          };
        },
      },
      {
        id: "mesekonyvek",
        build: () => {
          const a = ri(3, 12), b = ri(2, 9), s = 2 * a + b;
          return {
            text: `Evelin ${a} mesekönyvet olvasott el idén, a bátyja ${b} mesekönyvvel többet. Hány mesekönyvet olvastak el ketten együtt?`,
            work: `${a} + (${a} + ${b}) = ${a} + ${a + b} = ${s} mesekönyv`,
          };
        },
      },
    ],
  },
  {
    title: "Egyforma csoportok – szorzás",
    formula: "x = A × B",
    grade: "2–3. osztály",
    hint: "B darab, A elemű egyforma csoport: az összes darabszám szorzással jön ki.",
    exercises: [
      {
        id: "matricak",
        build: () => {
          const a = ri(2, 9), b = ri(2, 9), p = a * b;
          return {
            text: `Egy mappában ${a} matrica van. Hány matrica van ${b} mappában?`,
            work: `${a} × ${b} = ${p} matrica`,
          };
        },
      },
      {
        id: "tulipanok",
        build: () => {
          const a = ri(2, 9), b = ri(2, 9), p = a * b;
          return {
            text: `Egy csokor ${a} tulipánból áll. Hány tulipán van ${b} csokorban?`,
            work: `${a} × ${b} = ${p} tulipán`,
          };
        },
      },
      {
        id: "szekek",
        build: () => {
          const a = ri(2, 9), b = ri(2, 9), p = a * b;
          return {
            text: `Egy rendezvényre ${b} asztalt állítanak fel, mindegyik asztalhoz ${a} szék kerül. Hány szék kell összesen?`,
            work: `${a} × ${b} = ${p} szék`,
          };
        },
      },
    ],
  },
  {
    title: "Egyenlő szétosztás – osztás",
    formula: "x = A ÷ B",
    grade: "2–3. osztály",
    hint: "Egyenlő részekre osztás vagy kötegelés: az eredményt osztással kapjuk.",
    exercises: [
      {
        id: "keksz",
        build: () => {
          const q = ri(2, 8), b = ri(2, 5), a = q * b;
          return {
            text: `Samu ${a} kekszet oszt szét egyenlően ${b} gyerek között. Hány keksz jut mindegyiknek?`,
            work: `${a} ÷ ${b} = ${q} keksz`,
          };
        },
      },
      {
        id: "ceruza-koteg",
        build: () => {
          const q = ri(2, 10), b = ri(2, 5), a = q * b;
          return {
            text: `Bence ${a} ceruzát egyforma, ${b} ceruzás kötegekbe rendezett. Hány köteget kapott?`,
            work: `${a} ÷ ${b} = ${q} köteg`,
          };
        },
      },
      {
        id: "zsebpenz",
        build: () => {
          const q = 5 * ri(2, 18), b = ri(2, 5), a = q * b;
          return {
            text: `Édesapa ${a} forintot oszt szét egyenlően ${b} testvér között. Mennyi jut mindegyiküknek?`,
            work: `${a} ÷ ${b} = ${q} Ft`,
          };
        },
      },
    ],
  },
  {
    title: "Vásárlás – visszajáró",
    formula: "x = P − A × B",
    grade: "3–4. osztály",
    hint: "Előbb kiszámoljuk a teljes árat (A × B), majd a fizetett összegből kivonjuk.",
    exercises: [
      {
        id: "mozijegy",
        build: () => {
          const a = 5 * ri(6, 19), b = ri(2, 5), r = 5 * ri(3, 12), p = a * b + r;
          return {
            text: `Egy mozijegy ${a} forint. Zsombor ${b} jegyet vesz, és ${p} forintot ad a pénztárosnak. Mennyi visszajárót kap?`,
            work: `${p} − ${b} × ${a} = ${p} − ${a * b} = ${r} Ft`,
          };
        },
      },
      {
        id: "belyeg",
        build: () => {
          const a = 5 * ri(6, 19), b = ri(2, 5), r = 5 * ri(3, 12), p = a * b + r;
          return {
            text: `Egy bélyeg ${a} forint. Dorka ${b} darab bélyeget vesz, és ${p} forintot ad a pénztárosnak. Mennyi a visszajáró?`,
            work: `${p} − ${b} × ${a} = ${p} − ${a * b} = ${r} Ft`,
          };
        },
      },
      {
        id: "fagylalt",
        build: () => {
          const a = 5 * ri(6, 19), b = ri(2, 4), r = 5 * ri(3, 12), p = a * b + r;
          return {
            text: `Egy adag fagylalt ${a} forint. Marci ${b} adagot vesz, és ${p} forintot ad a fagylaltosnak. Mennyi visszajárót kap?`,
            work: `${p} − ${b} × ${a} = ${p} − ${a * b} = ${r} Ft`,
          };
        },
      },
    ],
  },
  {
    title: "Összeszedve, szétosztva",
    formula: "x = (A + B) ÷ C",
    grade: "3–4. osztály",
    hint: "Először összeszedjük a két adatot (A + B), aztán egyenlő részekre osztjuk.",
    exercises: [
      {
        id: "dio-mokus",
        build: () => {
          const q = ri(2, 12), c = ri(2, 5), sum = q * c, a = 2 + ri(0, sum - 4), b = sum - a;
          return {
            text: `Két kosárban ${a} és ${b} dió van. A diókat egyenlően szétosztják ${c} mókus között. Hány dió jut mindegyik mókusnak?`,
            work: `(${a} + ${b}) ÷ ${c} = ${sum} ÷ ${c} = ${q} dió`,
          };
        },
      },
      {
        id: "csoki-kocka",
        build: () => {
          const q = ri(2, 12), c = ri(2, 5), sum = q * c, a = 2 + ri(0, sum - 4), b = sum - a;
          return {
            text: `Két csokitáblán ${a} és ${b} kocka van. A kockákat egyenlően szétosztják ${c} gyerek között. Hány kocka jut mindegyiküknek?`,
            work: `(${a} + ${b}) ÷ ${c} = ${sum} ÷ ${c} = ${q} kocka`,
          };
        },
      },
      {
        id: "szoloszem",
        build: () => {
          const q = ri(2, 12), c = ri(2, 5), sum = q * c, a = 2 + ri(0, sum - 4), b = sum - a;
          return {
            text: `Két kosárban ${a} és ${b} szőlőszem van. A szemeket egyenlően szétosztják ${c} gyermek között. Hány szem jut mindegyiküknek?`,
            work: `(${a} + ${b}) ÷ ${c} = ${sum} ÷ ${c} = ${q} szem`,
          };
        },
      },
    ],
  },
];

window.MATEK_GROUPS = GROUPS;
