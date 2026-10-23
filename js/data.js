"use strict";

/* Adatmodell:
   - 8 feladatcsoport, megoldási logika szerint (képlet a csoport fejlécében)
   - csoportonként 6 valódi szövegű feladat (pool), egyszerre 3 látszik belőlük
   - minden feladatsablon számmodellt hív; a számokat a beállítások
     (operandus/eredmény tartomány, negatív engedélyezése) korlátozzák
   - ctx = { ranges: {opMin, opMax, resMin, resMax}, neg } */

/* Toleráns sorsolás: ha a tartomány érvénytelen, összeomlik a min-re. */
function looseInt(lo, hi) {
  lo = Math.ceil(lo); hi = Math.floor(hi);
  if (hi < lo) hi = lo;
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

/* --- számmodellek ----------------------------------------------- */

/* Összeg: a + b = x */
function sumPair(ctx) {
  const { opMin, opMax, resMin, resMax } = ctx.ranges;
  const x = looseInt(Math.max(resMin, 2 * opMin), Math.min(resMax, 2 * opMax));
  const a = looseInt(Math.max(opMin, x - opMax, 1), Math.min(opMax, x - 1));
  return { a, b: x - a, x };
}

/* Különbség: a − b = x (negatív eredmény csak ctx.neg esetén) */
function diff(ctx) {
  const { opMin, opMax, resMin, resMax } = ctx.ranges;
  const floor = ctx.neg ? -999 : Math.max(resMin, 0);
  const x = looseInt(Math.max(floor, 1 - opMax), Math.min(resMax, opMax - 1));
  const b = looseInt(Math.max(1, opMin - x), Math.min(opMax, opMax - x));
  return { a: x + b, b, x };
}

/* Hiányzó rész: a + x = b, x = b − a (eredmény mindig ≥ 1) */
function missing(ctx) {
  const { opMin, opMax, resMin, resMax } = ctx.ranges;
  const x = looseInt(Math.max(1, resMin), Math.min(resMax, opMax - Math.max(1, opMin)));
  const b = looseInt(opMin + x, opMax);
  return { a: b - x, b, x };
}

/* Kettős adat: a + (a + b) = x, azaz x = 2a + b */
function multi(ctx) {
  const { opMin, opMax, resMin, resMax } = ctx.ranges;
  const ahi = Math.min(opMax, Math.floor((resMax - 1) / 2));
  const a = looseInt(Math.min(opMin, ahi), ahi);
  const b = looseInt(Math.max(1, resMin - 2 * a), Math.min(opMax, resMax - 2 * a));
  return { a, b, x: 2 * a + b };
}

/* Szorzás: a × b = x */
function product(ctx) {
  const { opMin, opMax, resMin, resMax } = ctx.ranges;
  const ahi = Math.min(opMax, Math.max(2, Math.floor(resMax / 2)));
  const a = looseInt(Math.max(2, Math.min(opMin, ahi)), ahi);
  const b = looseInt(Math.max(2, Math.ceil(resMin / a)), Math.min(opMax, Math.floor(resMax / a)));
  return { a, b, x: a * b };
}

/* Osztás: a ÷ b = q (osztandó a, osztó b, hányados az eredmény) */
function quotient(ctx) {
  const { opMin, opMax, resMin, resMax } = ctx.ranges;
  const qhi = Math.min(resMax, Math.floor(opMax / 2));
  const q = looseInt(Math.max(1, Math.min(resMin, qhi)), qhi);
  const b = looseInt(Math.max(2, Math.min(opMin, Math.floor(opMax / q))), Math.min(opMax, Math.floor(opMax / q)));
  return { a: q * b, b, x: q };
}

/* Fizetés: p − (a × b) = x (p = fizetett, x = visszajáró; negatív = tartozás) */
function checkout(ctx) {
  const { opMin, opMax, resMin, resMax } = ctx.ranges;
  const floor = ctx.neg ? -999 : Math.max(resMin, 0);
  const ahi = Math.min(opMax, Math.max(2, Math.floor(opMax / 2)));
  const a = looseInt(Math.max(2, Math.min(opMin, ahi)), ahi);
  const b = looseInt(Math.max(2, 2), Math.min(opMax, Math.floor(opMax / a)));
  const p = a * b;
  const x = looseInt(Math.max(floor, resMin, -p), Math.min(resMax, opMax - p));
  return { a, b, p: p + x, x };
}

/* Összeszedve szétosztva: (a + b) ÷ c = q */
function shareSum(ctx) {
  const { opMin, opMax, resMin, resMax } = ctx.ranges;
  const chi = Math.min(opMax, Math.max(2, Math.floor(2 * opMax / Math.max(1, resMin))));
  const c = looseInt(Math.max(2, Math.min(opMin, chi)), chi);
  const qhi = Math.min(resMax, Math.max(1, Math.floor(2 * opMax / c)));
  const q = looseInt(Math.max(1, Math.min(resMin, qhi)), qhi);
  const sum = q * c;
  const alo = Math.max(1, sum - opMax);
  const ahi = Math.min(opMax, sum - 1);
  const prefer = Math.max(alo, opMin);
  const a = prefer <= ahi ? looseInt(prefer, ahi) : looseInt(alo, ahi);
  return { a, b: sum - a, c, x: q };
}

/* --- csoportok --------------------------------------------------- */

const GROUPS = [
  {
    title: "Két adat összege",
    formula: "x = A + B",
    grade: "1. osztály",
    hint: "Két adatot kell összeadni, a kérdés mindig az összegre kérdez.",
    num: (ctx) => sumPair(ctx),
    work: (n, u) => `${n.a} + ${n.b} = ${n.x} ${u}`,
    pool: [
      {
        id: "gesztenye",
        unit: "gesztenye",
        gen: (n) => ({
          text: `Benedek ${n.a} gesztenyét talált a fűben, utána még ${n.b} gesztenyét szedett össze a játszótéren. Hány gesztenyéje lett összesen?`,
        }),
      },
      {
        id: "virag",
        unit: "virág",
        gen: (n) => ({
          text: `Luca ${n.a} piros és ${n.b} sárga virágot szedett a mezőn. Hány virágot szedett összesen?`,
        }),
      },
      {
        id: "ceruza",
        unit: "ceruza",
        gen: (n) => ({
          text: `Botond ${n.a} ceruzát kapott a nagymamától és ${n.b} ceruzát a nagypapától. Hány ceruzája lett összesen?`,
        }),
      },
      {
        id: "polc",
        unit: "mesekönyv",
        gen: (n) => ({
          text: `A polcon ${n.a} magyar és ${n.b} angol mesekönyv van. Hány mesekönyv van összesen a polcon?`,
        }),
      },
      {
        id: "szulinap",
        unit: "gyerek",
        gen: (n) => ({
          text: `A születésnapi partin ${n.a} fiú és ${n.b} lány mulat. Hány gyerek van összesen a partin?`,
        }),
      },
      {
        id: "vereb",
        unit: "veréb",
        gen: (n) => ({
          text: `Délelőtt ${n.a} veréb, délután még ${n.b} veréb ereszkedett le az etetőre. Hány veréb járt az etetőn összesen?`,
        }),
      },
    ],
  },
  {
    title: "Elvétel: mennyi maradt",
    formula: "x = A − B",
    grade: "1. osztály",
    hint: "A kezdeti mennyiségből elveszünk valamennyit, a maradék a kivonás eredménye.",
    num: (ctx) => diff(ctx),
    work: (n, u) => `${n.a} − ${n.b} = ${n.x} ${u}`,
    pool: [
      {
        id: "golyok",
        unit: "golyó",
        gen: (n) => ({
          text: `Hugó ${n.a} golyóval játszott a homokozóban, majd ${n.b} golyót odaadott a kishúgának. Hány golyója maradt?`,
        }),
      },
      {
        id: "szilva",
        unit: "szilva",
        gen: (n) => ({
          text: `Réka ${n.a} szilvát vitt az iskolába, útközben ${n.b} szilvát megevett. Hány szilvája maradt?`,
        }),
      },
      {
        id: "lufik",
        unit: "lufi",
        gen: (n) => ({
          text: `Péter ${n.a} lufit kapott a farsangi mulatságon, ${n.b} elszállt az ég felé. Hány lufija maradt?`,
        }),
      },
      {
        id: "matek-feladat",
        unit: "feladat",
        gen: (n) => ({
          text: `Máté ${n.a} matematika feladatot kapott házi feladatként, ${n.b} feladatot ma már megoldott. Hány feladat vár még rá?`,
        }),
      },
      {
        id: "torta-szelet",
        unit: "szelet",
        gen: (n) => ({
          text: `Eszter ${n.a} szelet tortát vitt a szülinapi ünnepségre, ${n.b} szeletet elfogyasztottak. Hány szelet torta maradt?`,
        }),
      },
      {
        id: "hajo-utas",
        unit: "utas",
        gen: (n) => ({
          text: `A kis hajón ${n.a} utas utazott, ${n.b} utas kiszállt a kikötőben. Hány utas maradt a hajón?`,
        }),
      },
    ],
  },
  {
    title: "Hiányzó rész kiegészítése",
    formula: "x = B − A   (A + x = B)",
    grade: "1–2. osztály",
    hint: "Valamennyi hiányzik az összeshez: az összesből kivonjuk a már meglévő részt.",
    num: (ctx) => missing(ctx),
    work: (n, u) => `${n.b} − ${n.a} = ${n.x} ${u}`,
    pool: [
      {
        id: "busz",
        unit: "gyerek",
        gen: (n) => ({
          text: `Az osztálykirándulásra ${n.b} gyerek regisztrált, ${n.a} gyerek már beült a buszba. Hány gyerek száll még be a buszba?`,
        }),
      },
      {
        id: "lanyok",
        unit: "lány",
        gen: (n) => ({
          text: `Az osztályban ${n.b} gyerek van, ${n.a} közülük fiú. Hány lány van az osztályban?`,
        }),
      },
      {
        id: "toll",
        unit: "Ft",
        gen: (n) => ({
          text: `Bianka egy ${n.b} forintos tollat akar venni, a zsebében ${n.a} forint van. Mennyi pénz hiányzik még a tollhoz?`,
        }),
      },
      {
        id: "penzgyujtes",
        unit: "Ft",
        gen: (n) => ({
          text: `A kiránduláshoz összesen ${n.b} forintot kell gyűjteni, eddig ${n.a} forintot gyűjtöttek össze. Mennyi pénz hiányzik még?`,
        }),
      },
      {
        id: "konyv-lap",
        unit: "lap",
        gen: (n) => ({
          text: `Egy mesekönyv ${n.b} lapból áll, Dorina eddig ${n.a} lapot olvasott el. Hány lap van még hátra a végéig?`,
        }),
      },
      {
        id: "kirako",
        unit: "darabka",
        gen: (n) => ({
          text: `Egy kirakó ${n.b} darabkából áll, Anna már ${n.a} darabkát illesztett össze. Hány darabka van még hátra?`,
        }),
      },
    ],
  },
  {
    title: "Együtt, ha az egyiknek több van",
    formula: "x = A + (A + B)",
    grade: "2. osztály",
    hint: "Előbb kiszámoljuk a nagyobb mennyiséget (A + B), majd a kettő összegét.",
    num: (ctx) => multi(ctx),
    work: (n, u) => `${n.a} + (${n.a} + ${n.b}) = ${n.a} + ${n.x - n.a} = ${n.x} ${u}`,
    pool: [
      {
        id: "kisautok",
        unit: "kisautó",
        gen: (n) => ({
          text: `Zalánnak ${n.a} kisautója van, kishúgának ${n.b}-vel több kisautója van. Hány kisautójuk van együtt?`,
        }),
      },
      {
        id: "gumicukor",
        unit: "gumicukor",
        gen: (n) => ({
          text: `Levi ${n.a} gumicukrot evett a moziban, nővére ${n.b}-vel többet. Hány gumicukrot ettek együtt?`,
        }),
      },
      {
        id: "mesekonyvek",
        unit: "mesekönyv",
        gen: (n) => ({
          text: `Evelin ${n.a} mesekönyvet olvasott el idén, a bátyja ${n.b} mesekönyvvel többet. Hány mesekönyvet olvastak el ketten együtt?`,
        }),
      },
      {
        id: "lego-var",
        unit: "kocka",
        gen: (n) => ({
          text: `Áron ${n.a} kockából épített várat, kishúga ${n.b} kockával több elemet használt. Hány kockából épült a két vár együtt?`,
        }),
      },
      {
        id: "matrica-teso",
        unit: "matrica",
        gen: (n) => ({
          text: `Olivér ${n.a} matricát kapott, a tesója ${n.b} matricával többet. Hány matricájuk lett együtt?`,
        }),
      },
      {
        id: "papirrepulo",
        unit: "papírrepülő",
        gen: (n) => ({
          text: `Máté ${n.a} papírrepülőt hajtogatott, a testvére ${n.b} repülővel többet. Hány papírrepülő készült összesen?`,
        }),
      },
    ],
  },
  {
    title: "Egyforma csoportok – szorzás",
    formula: "x = A × B",
    grade: "2–3. osztály",
    hint: "B darab, A elemű egyforma csoport: az összes darabszám szorzással jön ki.",
    num: (ctx) => product(ctx),
    work: (n, u) => `${n.a} × ${n.b} = ${n.x} ${u}`,
    pool: [
      {
        id: "matrica-lap",
        unit: "matrica",
        gen: (n) => ({
          text: `Egy matricalap ${n.a} matricát tartalmaz. Hány matrica van ${n.b} matricalapon?`,
        }),
      },
      {
        id: "tulipan-csokor",
        unit: "tulipán",
        gen: (n) => ({
          text: `Egy csokor ${n.a} tulipánból áll. Hány tulipán van ${n.b} csokorban?`,
        }),
      },
      {
        id: "rendezveny-szek",
        unit: "szék",
        gen: (n) => ({
          text: `Egy rendezvényre ${n.b} asztalt állítanak fel, mindegyik asztalhoz ${n.a} szék kerül. Hány szék kell összesen?`,
        }),
      },
      {
        id: "kifli-talca",
        unit: "kifli",
        gen: (n) => ({
          text: `Egy pékség ${n.b} tálcát készít, mindegyik tálcán ${n.a} kifli van. Hány kifli van összesen a tálcákon?`,
        }),
      },
      {
        id: "mandarin-lada",
        unit: "mandarin",
        gen: (n) => ({
          text: `Egy ládában ${n.a} mandarin van. Hány mandarin van ${n.b} ládában?`,
        }),
      },
      {
        id: "borso-huvely",
        unit: "borsó",
        gen: (n) => ({
          text: `Egy hüvelyben ${n.a} borsó lapul. Hány borsó van ${n.b} hüvelyben?`,
        }),
      },
    ],
  },
  {
    title: "Egyenlő szétosztás – osztás",
    formula: "x = A ÷ B",
    grade: "2–3. osztály",
    hint: "Egyenlő részekre osztás vagy kötegelés: az eredményt osztással kapjuk.",
    num: (ctx) => quotient(ctx),
    work: (n, u) => `${n.a} ÷ ${n.b} = ${n.x} ${u}`,
    pool: [
      {
        id: "keksz",
        unit: "keksz",
        gen: (n) => ({
          text: `Samu ${n.a} kekszet oszt szét egyenlően ${n.b} gyerek között. Hány keksz jut mindegyiknek?`,
        }),
      },
      {
        id: "ceruza-koteg",
        unit: "köteg",
        gen: (n) => ({
          text: `Bence ${n.a} ceruzát egyforma, ${n.b} ceruzás kötegekbe rendezett. Hány köteget kapott?`,
        }),
      },
      {
        id: "zsebpenz",
        unit: "Ft",
        gen: (n) => ({
          text: `Édesapa ${n.a} forintot oszt szét egyenlően ${n.b} testvér között. Mennyi jut mindegyiküknek?`,
        }),
      },
      {
        id: "csoki-szelet",
        unit: "szelet",
        gen: (n) => ({
          text: `Édesanya ${n.a} csokiszeletet oszt ki egyenlően ${n.b} gyerek között. Hány szelet jut mindegyiknek?`,
        }),
      },
      {
        id: "tulipan-kotes",
        unit: "csokor",
        gen: (n) => ({
          text: `A virágárus ${n.a} tulipánt egyforma csokorba kötött, mindegyik csokorba ${n.b} tulipán került. Hány csokrot kötött?`,
        }),
      },
      {
        id: "szovnyeg-sor",
        unit: "sor",
        gen: (n) => ({
          text: `Egy tornateremben ${n.a} tornaszőnyeget raknak sorokba, mindegyik sorba ${n.b} szőnyeg kerül. Hány sor lesz összesen?`,
        }),
      },
    ],
  },
  {
    title: "Vásárlás – visszajáró",
    formula: "x = P − A × B",
    grade: "3–4. osztály",
    hint: "Előbb kiszámoljuk a teljes árat (A × B), majd a fizetett összegből kivonjuk.",
    num: (ctx) => checkout(ctx),
    work: (n) => `${n.p} − ${n.b} × ${n.a} = ${n.p} − ${n.p - n.x} = ${n.x} Ft`,
    pool: [
      {
        id: "mozijegy",
        unit: "Ft",
        gen: (n) => ({
          text: `Egy mozijegy ${n.a} forint. Zsombor ${n.b} jegyet vesz, és ${n.p} forintot ad a pénztárosnak. Mennyi visszajárót kap?`,
        }),
      },
      {
        id: "belyeg",
        unit: "Ft",
        gen: (n) => ({
          text: `Egy bélyeg ${n.a} forint. Dorka ${n.b} darab bélyeget vesz, és ${n.p} forintot ad a pénztárosnak. Mennyi a visszajáró?`,
        }),
      },
      {
        id: "fagylalt",
        unit: "Ft",
        gen: (n) => ({
          text: `Egy adag fagylalt ${n.a} forint. Marci ${n.b} adagot vesz, és ${n.p} forintot ad a fagylaltosnak. Mennyi visszajárót kap?`,
        }),
      },
      {
        id: "udito",
        unit: "Ft",
        gen: (n) => ({
          text: `Egy üveg üdítő ${n.a} forint. Zsófi ${n.b} üveget vesz, és ${n.p} forintot ad a pénztárosnak. Mennyi visszajárót kap?`,
        }),
      },
      {
        id: "fuzet",
        unit: "Ft",
        gen: (n) => ({
          text: `Egy füzet ${n.a} forint. Anna ${n.b} füzetet vesz, és ${n.p} forintot ad a boltosnak. Mennyi visszajárót kap?`,
        }),
      },
      {
        id: "pizza",
        unit: "Ft",
        gen: (n) => ({
          text: `Egy szelet pizza ${n.a} forint. Levente ${n.b} szeletet vesz, és ${n.p} forintot ad a pénztárosnak. Mennyi a visszajáró?`,
        }),
      },
    ],
  },
  {
    title: "Összeszedve, szétosztva",
    formula: "x = (A + B) ÷ C",
    grade: "3–4. osztály",
    hint: "Először összeszedjük a két adatot (A + B), aztán egyenlő részekre osztjuk.",
    num: (ctx) => shareSum(ctx),
    work: (n, u) => `(${n.a} + ${n.b}) ÷ ${n.c} = ${n.a + n.b} ÷ ${n.c} = ${n.x} ${u}`,
    pool: [
      {
        id: "dio-mokus",
        unit: "dió",
        gen: (n) => ({
          text: `Két kosárban ${n.a} és ${n.b} dió van. A diókat egyenlően szétosztják ${n.c} mókus között. Hány dió jut mindegyik mókusnak?`,
        }),
      },
      {
        id: "csoki-kocka",
        unit: "kocka",
        gen: (n) => ({
          text: `Két csokitáblán ${n.a} és ${n.b} kocka van. A kockákat egyenlően szétosztják ${n.c} gyerek között. Hány kocka jut mindegyiküknek?`,
        }),
      },
      {
        id: "szoloszem",
        unit: "szem",
        gen: (n) => ({
          text: `Két kosárban ${n.a} és ${n.b} szőlőszem van. A szemeket egyenlően szétosztják ${n.c} gyermek között. Hány szem jut mindegyiküknek?`,
        }),
      },
      {
        id: "szendvics-taska",
        unit: "szendvics",
        gen: (n) => ({
          text: `Két táskában ${n.a} és ${n.b} szendvics van. A szendvicseket egyenlően osztják el ${n.c} kiránduló között. Hány szendvics jut mindegyiküknek?`,
        }),
      },
      {
        id: "epitokocka",
        unit: "kocka",
        gen: (n) => ({
          text: `Két dobozban ${n.a} és ${n.b} építőkocka van. A kockákat egyenlően osztják szét ${n.c} gyerek között. Hány kocka jut mindegyik gyereknek?`,
        }),
      },
      {
        id: "korong-jatek",
        unit: "korong",
        gen: (n) => ({
          text: `Két dobozban ${n.a} és ${n.b} korong van. A korongokat egyenlően osztják el ${n.c} játékos között. Hány korong jut mindegyik játékosnak?`,
        }),
      },
    ],
  },
];

window.MATEK_GROUPS = GROUPS;
