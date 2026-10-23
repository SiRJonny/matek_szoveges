// Véletlen segédfüggvények. Minden generátor ezeken keresztül randomizál.
// seed megadható (--seed), így ugyanaz a feladatsor újra-előállítható (teszteléshez).

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeRandom(seedStr) {
  let seed = seedStr == null
    ? (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0
    : hashString(String(seedStr));
  const next = mulberry32(seed);
  return {
    /** egész szám min..max (inkulzív) */
    int(min, max) {
      return min + Math.floor(next() * (max - min + 1));
    },
    /** véletlen elem */
    pick(arr) {
      return arr[Math.floor(next() * arr.length)];
    },
    /** helyben keverés */
    shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    seed,
  };
}

function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
