"use strict";

/* Megjelenítés és interakció:
   - csoportonként 6 sablonból 3 látszik egyszerre
   - feladatonkénti gombok: új szöveg / új számok / másolás
   - a megoldás a feladat mellett, a nyomtatási területen KÍVÜL jelenik meg
   - beállítások: operandus és eredmény tartomány, negatív számok engedélyezése */

(function () {
  const GROUPS = window.MATEK_GROUPS;
  const PER_GROUP = 3;
  const HUES = [258, 14, 160, 32, 206, 286, 6, 186];

  const settings = { opMin: 10, opMax: 999, resMin: 0, resMax: 999, neg: false };
  const slots = []; // { group, themeIdx, theme, data, card, keyEl, num }

  const groupsEl = document.getElementById("groups");
  const keyEl = document.getElementById("key");

  function makeCtx() {
    return { ranges: settings, neg: settings.neg };
  }

  function flash(el) {
    el.classList.remove("flash");
    void el.offsetWidth;
    el.classList.add("flash");
  }

  function paint(slot) {
    slot.card.querySelector(".t-text").textContent = slot.data.text;
    slot.card.querySelector(".t-sol").textContent = slot.data.work;
    slot.keyEl.querySelector(".k-sol").textContent = slot.data.work;
    flash(slot.card);
    flash(slot.keyEl);
  }

  /* Sablonváltásnál kerüljük a csoport másik két kártyáján már látható sablonokat. */
  function pickThemeIdx(group, current, selfIdx) {
    const used = new Set();
    slots.forEach((s) => {
      if (s.group === group && s !== slots[selfIdx]) used.add(s.themeIdx);
    });
    let cand = [];
    for (let i = 0; i < group.pool.length; i++) {
      if (i !== current && !used.has(i)) cand.push(i);
    }
    if (cand.length === 0) {
      for (let i = 0; i < group.pool.length; i++) if (i !== current) cand.push(i);
    }
    return cand[Math.floor(Math.random() * cand.length)];
  }

  function genSlot(slot) {
    const n = slot.group.num(makeCtx());
    slot.data = { text: slot.theme.gen(n).text, work: slot.group.work(n, slot.theme.unit) };
  }

  function newText(slot) {
    slot.themeIdx = pickThemeIdx(slot.group, slot.themeIdx, slots.indexOf(slot));
    slot.theme = slot.group.pool[slot.themeIdx];
    genSlot(slot);
    paint(slot);
  }

  function newNums(slot) {
    genSlot(slot);
    paint(slot);
  }

  function copySlot(slot, btn) {
    const text = slot.data.text;
    const done = () => {
      const old = btn.textContent;
      btn.textContent = "✓ Kimásolva";
      setTimeout(() => { btn.textContent = old; }, 1300);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, () => copyFallback(text, done));
    } else {
      copyFallback(text, done);
    }
  }

  function copyFallback(text, done) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    done();
  }

  function taskCard(slot, num) {
    const card = document.createElement("article");
    card.className = "task-card";
    card.innerHTML =
      `<span class="t-num">${num}.</span>` +
      `<span class="t-body">` +
      `<span class="t-text"></span>` +
      `<span class="t-calc">Számítás: <span class="dots" aria-hidden="true"></span>` +
      ` Válasz: <span class="dots ans" aria-hidden="true"></span></span>` +
      `</span>` +
      `<aside class="t-side no-print">` +
      `<span class="t-sol-label">Megoldás</span>` +
      `<span class="t-sol"></span>` +
      `<span class="t-btns">` +
      `<button class="btn mini" data-act="text">🔁 Új szöveg</button>` +
      `<button class="btn mini" data-act="nums">🎲 Új számok</button>` +
      `<button class="btn mini" data-act="copy">📋 Másolás</button>` +
      `</span></aside>`;
    card.querySelectorAll("[data-act]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const act = btn.dataset.act;
        if (act === "text") newText(slot);
        else if (act === "nums") newNums(slot);
        else copySlot(slot, btn);
      });
    });
    return card;
  }

  function keyItem(num) {
    const li = document.createElement("li");
    li.className = "key-item";
    li.innerHTML = `<span class="k-num">${num}.</span><span class="k-sol"></span>`;
    return li;
  }

  function render() {
    let num = 1;
    GROUPS.forEach((group, gi) => {
      const sec = document.createElement("section");
      sec.className = "group";
      sec.style.setProperty("--hue", HUES[gi % HUES.length]);
      sec.innerHTML =
        `<header class="group-head">` +
        `<div class="group-title"><h3>${group.title}</h3><p class="group-hint">${group.hint}</p></div>` +
        `<div class="chips">` +
        `<span class="chip formula">${group.formula}</span>` +
        `<span class="chip grade">${group.grade} · ${group.pool.length} példa</span>` +
        `</div></header>`;
      const wrap = document.createElement("div");
      wrap.className = "tasks";
      sec.appendChild(wrap);
      groupsEl.appendChild(sec);

      const idxs = group.pool.map((_, i) => i);
      for (let i = idxs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
      }

      for (let i = 0; i < PER_GROUP; i++) {
        const slot = { group, num, themeIdx: idxs[i], theme: group.pool[idxs[i]] };
        slot.card = taskCard(slot, num);
        wrap.appendChild(slot.card);
        slot.keyEl = keyItem(num);
        keyEl.appendChild(slot.keyEl);
        genSlot(slot);
        paint(slot);
        slots.push(slot);
        num++;
      }
    });

    const shown = PER_GROUP * GROUPS.length;
    document.getElementById("stats").textContent =
      `${shown} feladat látszik · ${slots[0].group.pool.length}×${GROUPS.length} sablon a háttérben`;
  }

  /* --- beállítások ------------- */
  function readSettings() {
    const num = (id, def) => {
      const v = parseInt(document.getElementById(id).value, 10);
      return Number.isFinite(v) ? v : def;
    };
    let opMin = num("op-min", 10), opMax = num("op-max", 999);
    let resMin = num("res-min", 0), resMax = num("res-max", 999);
    if (opMin > opMax) [opMin, opMax] = [opMax, opMin];
    if (resMin > resMax) [resMin, resMax] = [resMax, resMin];
    settings.opMin = opMin; settings.opMax = opMax;
    settings.resMin = resMin; settings.resMax = resMax;
    settings.neg = document.getElementById("neg-check").checked;
    slots.forEach(newNums);
  }
  ["op-min", "op-max", "res-min", "res-max"].forEach((id) => {
    document.getElementById(id).addEventListener("change", readSettings);
  });
  document.getElementById("neg-check").addEventListener("change", readSettings);

  /* --- gombok ------------- */
  document.getElementById("btn-print").addEventListener("click", () => window.print());
  document.getElementById("btn-shuffle").addEventListener("click", () => {
    slots.forEach((slot) => newText(slot));
  });
  const btnKey = document.getElementById("btn-key");
  btnKey.addEventListener("click", () => {
    document.body.classList.toggle("no-key");
    btnKey.textContent = document.body.classList.contains("no-key")
      ? "👁️ Megoldókulcs előtűntetése"
      : "🙈 Megoldókulcs elrejtése";
  });

  render();
})();
