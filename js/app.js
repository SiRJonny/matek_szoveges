"use strict";

/* Megjelenítés és interakció:
   - feladatlap csoportosítva megoldási logika szerint
   - megoldókulcs a második oldalon, feladatszámokkal szinkronban
   - kattintásra (vagy Enterre) a feladat újraszámol: új számok, új eredmény */

(function () {
  const GROUPS = window.MATEK_GROUPS;
  const ALL_EX = GROUPS.flatMap((g) => g.exercises);
  const HUES = [258, 14, 160, 32, 206, 286, 6, 186];

  const state = new Map(); // exercise id -> {text, work}

  // --- építő elemek ---------------------------------------------------------

  function taskCard(num) {
    const card = document.createElement("article");
    card.className = "task-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.title = "Kattints az újraszámoláshoz";
    card.innerHTML =
      `<span class="t-num">${num}.</span>` +
      `<span class="t-body">` +
      `<span class="t-text"></span>` +
      `<span class="t-calc">Számítás: <span class="dots" aria-hidden="true"></span>` +
      ` Válasz: <span class="dots ans" aria-hidden="true"></span></span>` +
      `</span>` +
      `<span class="dice" aria-hidden="true">🎲</span>`;
    return card;
  }

  function keyItem(num) {
    const li = document.createElement("li");
    li.className = "key-item";
    li.tabIndex = 0;
    li.setAttribute("role", "button");
    li.title = "Kattints az újraszámoláshoz";
    li.innerHTML =
      `<span class="k-num">${num}.</span><span class="k-sol"></span>` +
      `<span class="dice" aria-hidden="true">🎲</span>`;
    return li;
  }

  // --- kirajzolás és újragenerálás -------------------------------------------

  function paint(ex) {
    const r = state.get(ex.id);
    document.querySelectorAll(`[data-id="${ex.id}"]`).forEach((el) => {
      if (el.classList.contains("task-card")) el.querySelector(".t-text").textContent = r.text;
      else el.querySelector(".k-sol").textContent = r.work;
      el.classList.remove("flash");
      void el.offsetWidth;
      el.classList.add("flash");
    });
  }

  function regenerate(ex) {
    state.set(ex.id, ex.build());
    paint(ex);
  }

  function regenAll() {
    ALL_EX.forEach(regenerate);
  }

  // --- első rajz --------------------------------------------------------------

  function render() {
    const groupsEl = document.getElementById("groups");
    const keyEl = document.getElementById("key");
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
        `<span class="chip grade">${group.grade}</span>` +
        `</div></header>`;
      const wrap = document.createElement("div");
      wrap.className = "tasks";
      sec.appendChild(wrap);
      groupsEl.appendChild(sec);

      group.exercises.forEach((ex) => {
        ex.num = num;
        const card = taskCard(num);
        card.dataset.id = ex.id;
        wrap.appendChild(card);

        const ki = keyItem(num);
        ki.dataset.id = ex.id;
        keyEl.appendChild(ki);

        state.set(ex.id, ex.build());
        paint(ex);
        num++;
      });
    });

    document.getElementById("stats").textContent =
      `${ALL_EX.length} feladat · ${GROUPS.length} megoldási minta`;
  }

  // --- események ---------------------------------------------------------------

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-id]");
    if (!el) return;
    const ex = ALL_EX.find((x) => x.id === el.dataset.id);
    if (ex) regenerate(ex);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const el = e.target.closest("[data-id]");
    if (!el) return;
    if (e.key === " ") e.preventDefault();
    const ex = ALL_EX.find((x) => x.id === el.dataset.id);
    if (ex) regenerate(ex);
  });

  document.getElementById("btn-print").addEventListener("click", () => window.print());
  document.getElementById("btn-shuffle").addEventListener("click", regenAll);

  const btnKey = document.getElementById("btn-key");
  btnKey.addEventListener("click", () => {
    document.body.classList.toggle("no-key");
    btnKey.textContent = document.body.classList.contains("no-key")
      ? "👁️ Megoldókulcs előtűntetése"
      : "🙈 Megoldókulcs elrejtése";
  });

  render();
})();
