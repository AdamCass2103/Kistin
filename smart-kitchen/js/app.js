const $ = s => document.querySelector(s);

const ic = {
  "index.html": '<circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/>',
  "inventory.html": '<path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8"/>',
  "alerts.html": '<path d="M6 16V11a6 6 0 0112 0v5l2 2H4z"/><path d="M10 21h4"/>',
  "recipes.html": '<path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>'
};

const nav = [
  ["index.html", "Overview"],
  ["inventory.html", "Inventory"],
  ["alerts.html", "Alerts"],
  ["recipes.html", "Use it up"]
];
const page = document.body.dataset.page;

$("#side").innerHTML =
  `<div class="logo"><i>🍃</i>Kistin</div><p class="eyebrow">Kitchen workspace</p><nav>` +
  nav
    .map(
      ([h, t]) =>
        `<a href="${h}" class="${h == page ? "on" : ""}"><svg viewBox="0 0 24 24">${ic[h]}</svg>${t}${h == "alerts.html" ? '<span class="badge">2</span>' : ""}</a>`
    )
    .join("") +
  `</nav><div class="foot"><div>📷 Pantry camera<small>● Online</small></div><div>Alex's kitchen<small>Prototype mode</small></div></div>`;

const pill = d =>
  d == null
    ? '<span class="pill grn">Long life</span>'
    : `<span class="pill ${d <= 2 ? "red" : "amb"}">${d} day${d == 1 ? "" : "s"} left</span>`;
const colours = ["#dbeafe", "#dcfce7", "#fef3c7", "#fee2e2", "#ede9fe"];
const av = (n, i) => `<span class="av" style="background:${colours[i % 5]}">${n[0]}</span>`;

if (page == "index.html") {
  $("#date").textContent = new Date().toLocaleDateString("en-IE", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
  $("#next").innerHTML = [...items]
    .filter(i => i.days != null)
    .sort((a, b) => a.days - b.days)
    .slice(0, 3)
    .map(
      (i, k) =>
        `<div class="item">${av(i.name, k)}<div style="flex:1"><b>${i.name}</b><small>${i.qty} · ${i.loc}</small></div>${pill(i.days)}</div>`
    )
    .join("");

  const steps = [
    "Pantry door opened…",
    "Photo captured…",
    "Recognising items…",
    "Inventory updated: +1 Cheddar"
  ];
  const run = () => {
    const c = $(".cam");
    const s = $("#status");
    c.classList.add("go");
    steps.forEach((t, k) =>
      setTimeout(() => {
        s.textContent = t;
        if (k == 3) {
          c.classList.remove("go");
          $("#tracked").textContent = 25;
          toast("Demo complete: Cheddar added to inventory");
        }
      }, k * 1500)
    );
  };
  $("#demo").onclick = run;
  $("#demoTop").onclick = run;
}

if (page == "inventory.html") {
  let f = "All";
  let q = "";

  const draw = () => {
    const l = items.filter(
      i => (f == "All" || i.loc == f) && i.name.toLowerCase().includes(q)
    );
    $("#rows").innerHTML =
      l
        .map(
          (i, k) =>
            `<tr><td><div class="nm">${av(i.name, k)}<div>${i.name}<small>Seen today at 09:41</small></div></div></td><td><span class="pill gry">${i.loc}</span></td><td>${pill(i.days)}</td><td>${i.qty}</td></tr>`
        )
        .join("") || '<tr><td colspan="4">No items found</td></tr>';
  };

  $("#q").oninput = e => {
    q = e.target.value.toLowerCase();
    draw();
  };
  document.querySelectorAll(".chip button").forEach(
    b =>
      (b.onclick = () => {
        document
          .querySelectorAll(".chip button")
          .forEach(x => x.classList.remove("on"));
        b.classList.add("on");
        f = b.dataset.f;
        draw();
      })
  );
  $("#add").onclick = () => $("#dlg").showModal();
  $("#cancel").onclick = () => $("#dlg").close();
  $("#form").onsubmit = e => {
    e.preventDefault();
    const d = $("#d").value;
    items.push({
      name: $("#n").value,
      loc: $("#l").value,
      days: d ? +d : null,
      qty: $("#qt").value || "1"
    });
    $("#dlg").close();
    e.target.reset();
    draw();
  };

  draw();
}

if (page == "recipes.html") {
  $("#recipes").innerHTML = recipes
    .map(
      r =>
        `<div class="card"><div class="plate" style="background:${r.bg};--f:${r.f}"><i></i><em>${r.match}%</em></div><p class="eyebrow">${r.tag}</p><h3>${r.title}</h3><p class="sub">Uses ${r.uses} of your items · ${r.mins} min</p><br><button class="btn ghost" style="width:100%">View recipe →</button></div>`
    )
    .join("");
}

if (page == "alerts.html") {
  const b = $("#addlist");
  b.onclick = () => {
    b.textContent = "Added ✓";
    toast("Milk added to your shopping list");
  };
}

function toast(t) {
  const e = $("#toast");
  e.textContent = t;
  e.style.display = "block";
  setTimeout(() => (e.style.display = "none"), 2500);
}
