(function () {
  "use strict";

  const PAYS_PER_ROW = 13;

  const DEFAULTS = {
    salary: 150000,
    remLimit: 24500,
    remPays: 26,
    frontLoadPays: 3,
    maxCheckPct: 75,
    matchCapPct: 6.0,
    matchRate: 50.0,
  };

  // --- Calculation ---

  function calculateStrategy(
    remainingLimit,
    remainingPays,
    baseSalary,
    maxContribPct,
    matchCap,
    frontLoadCount
  ) {
    remainingPays = Math.trunc(remainingPays);
    frontLoadCount = Math.trunc(Math.min(frontLoadCount, remainingPays));
    const biweeklyGross = baseSalary / 26.0;

    const restContribution = Math.ceil(biweeklyGross * (matchCap / 100.0));
    const maxCheckDollars = Math.floor(biweeklyGross * (maxContribPct / 100.0));

    remainingLimit = Math.trunc(remainingLimit);
    const restCount = remainingPays - frontLoadCount;

    const minRestTotal = restContribution * restCount;
    const availableForFront = remainingLimit - minRestTotal;

    if (availableForFront < 0) {
      const val = Math.floor(remainingLimit / remainingPays);
      return { schedule: Array(remainingPays).fill(val), biweeklyGross, restPer: val };
    }

    if (frontLoadCount === 0) {
      const restPer = Math.floor(remainingLimit / restCount);
      return { schedule: Array(restCount).fill(restPer), biweeklyGross, restPer };
    }

    const frontPer = Math.min(
      Math.floor(availableForFront / frontLoadCount),
      maxCheckDollars
    );
    const frontTotal = frontPer * frontLoadCount;

    const restPer = restCount > 0 ? Math.floor((remainingLimit - frontTotal) / restCount) : 0;

    const schedule = [
      ...Array(frontLoadCount).fill(frontPer),
      ...Array(restCount).fill(restPer),
    ];

    return { schedule, biweeklyGross, restPer };
  }

  // --- Styles ---

  function injectStyles() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);

    const css = `
      :root {
        --bg: #0a0e11;
        --surface: #101a1d;
        --surface-hover: #15242a;
        --border: rgba(0,128,128,0.22);
        --border-subtle: rgba(0,128,128,0.12);
        --text: #e8f0f0;
        --text-muted: #7a9a9a;
        --teal: #00a3a3;
        --teal-light: #00cccc;
        --teal-dim: rgba(0,163,163,0.12);
        --green: #2dd4a8;
        --green-dim: rgba(45,212,168,0.12);
        --red: #f87171;
        --red-dim: rgba(248,113,113,0.12);
        --radius: 12px;
        --transition: 200ms ease;
        --shadow: 0 4px 12px rgba(0,128,128,0.08);
        --shadow-hover: 0 8px 24px rgba(0,128,128,0.18);
      }

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { height: 100%; overflow: hidden; }
      body {
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: var(--bg); color: var(--text);
        display: flex; -webkit-font-smoothing: antialiased;
      }

      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

      .sidebar {
        width: 300px; min-width: 300px;
        background: linear-gradient(180deg, var(--surface) 0%, #0c1416 100%);
        border-right: 1px solid var(--border-subtle); padding: 1.5rem;
        height: 100%; display: flex; flex-direction: column;
      }
      .sidebar h2 {
        font-size: 0.7rem; font-weight: 600; letter-spacing: 0.08em;
        text-transform: uppercase; color: var(--text-muted);
        margin: 1.4rem 0 0.7rem;
      }
      .sidebar h2:first-child { margin-top: 0; }
      .sidebar hr {
        border: none; border-top: 1px solid var(--border-subtle); margin: 1rem 0;
      }

      .main { flex: 1; padding: 2.5rem 3rem; height: 100%; overflow-y: auto; }
      .main h1 {
        font-size: 1.65rem; font-weight: 700; letter-spacing: -0.02em;
        margin-bottom: 0.35rem;
      }
      .main .subtitle {
        color: var(--text-muted); margin-bottom: 2rem;
        font-size: 0.9rem; line-height: 1.5; max-width: 100%;
      }

      .input-group { margin-bottom: 0.9rem; }
      .input-group label {
        display: block; font-size: 0.78rem; font-weight: 500;
        color: var(--text-muted); margin-bottom: 0.3rem;
      }
      .input-group input[type="number"] {
        width: 100%; padding: 0.5rem 0.7rem; background: var(--bg);
        border: 1px solid var(--border); border-radius: var(--radius);
        color: var(--text); font-size: 0.88rem; font-family: inherit;
        transition: border-color var(--transition), box-shadow var(--transition);
        outline: none;
      }
      .input-group input[type="number"]:focus {
        border-color: var(--teal);
        box-shadow: 0 0 0 3px var(--teal-dim);
      }
      .input-group input[type="range"] {
        width: 100%; accent-color: var(--teal);
        margin-top: 2px; cursor: pointer;
      }
      .range-value {
        display: inline-block; font-size: 0.78rem; font-weight: 600;
        color: var(--teal-light); float: right;
      }

      .metrics { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
      .metric-card {
        flex: 1; min-width: 180px; background: var(--surface);
        border: 1px solid var(--border); border-radius: var(--radius);
        padding: 1.1rem 1.3rem; box-shadow: var(--shadow);
        transition: border-color var(--transition), box-shadow var(--transition), transform var(--transition);
      }
      .metric-card:hover {
        border-color: var(--teal);
        box-shadow: var(--shadow-hover);
        transform: translateY(-2px);
      }
      .metric-card .label {
        font-size: 0.72rem; font-weight: 600; letter-spacing: 0.04em;
        text-transform: uppercase; color: var(--text-muted);
      }
      .metric-card .value {
        font-size: 1.55rem; font-weight: 700; margin-top: 0.3rem;
        letter-spacing: -0.01em;
      }
      .metric-card .delta {
        font-size: 0.78rem; font-weight: 500; color: var(--red); margin-top: 0.2rem;
      }

      #chart {
        width: 100%; height: 450px; margin-bottom: 2rem;
        background: var(--surface); border: 1px solid var(--border);
        border-radius: var(--radius); overflow: hidden;
      }

      h2.section {
        font-size: 1rem; font-weight: 600; letter-spacing: -0.01em;
        margin-bottom: 0.9rem; color: var(--text);
      }

      .schedule-table {
        width: 100%; border-collapse: separate; border-spacing: 0;
        margin-bottom: 1rem; font-size: 0.82rem; table-layout: fixed;
        border: 1px solid var(--border); border-radius: var(--radius);
        overflow: hidden;
      }
      .schedule-table th, .schedule-table td {
        border-bottom: 1px solid var(--border-subtle);
        border-right: 1px solid var(--border-subtle);
        padding: 0.55rem 0.7rem; text-align: right;
      }
      .schedule-table th:last-child,
      .schedule-table td:last-child { border-right: none; }
      .schedule-table tbody tr:last-child td { border-bottom: none; }
      .schedule-table th {
        background: var(--surface); color: var(--text-muted);
        font-weight: 600; font-size: 0.75rem; white-space: nowrap;
        letter-spacing: 0.02em;
      }
      .schedule-table td {
        font-variant-numeric: tabular-nums;
        transition: background-color var(--transition);
      }
      .schedule-table tbody tr:hover td:not(.row-label) {
        background: var(--surface-hover);
      }
      .schedule-table td.row-label {
        text-align: left; font-weight: 600; color: var(--text-muted);
        background: var(--surface); white-space: nowrap;
        width: 160px; min-width: 160px; font-size: 0.75rem;
        letter-spacing: 0.01em;
      }

      .exec-plan {
        border-radius: var(--radius); padding: 1.2rem 1.4rem; margin-top: 2rem;
        line-height: 1.75; font-size: 0.9rem;
      }
      .exec-plan.success {
        background: var(--green-dim);
        border: 1px solid rgba(45,212,168,0.3);
      }
      .exec-plan.error {
        background: var(--red-dim);
        border: 1px solid rgba(248,113,113,0.3);
      }
      .exec-plan strong { color: var(--text); }
      .exec-plan em { color: var(--text-muted); font-style: normal; }

      .footnote {
        margin-top: auto; padding-top: 1rem;
        border-top: 1px solid var(--border-subtle);
        font-size: 0.7rem; color: var(--text-muted); text-align: center;
        line-height: 1.6; opacity: 0.7;
      }

      @media (max-width: 768px) {
        body { flex-direction: column; }
        .sidebar {
          width: 100%; min-width: 0; height: auto;
          border-right: none; border-bottom: 1px solid var(--border-subtle);
        }
        .main { padding: 1.5rem 1rem; height: auto; overflow-y: visible; }
        html, body { overflow: auto; }
      }
    `;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  // --- DOM helpers ---

  function el(tag, attrs, ...children) {
    const e = document.createElement(tag);
    if (attrs) Object.entries(attrs).forEach(([k, v]) => {
      if (k.startsWith("on")) e.addEventListener(k.slice(2).toLowerCase(), v);
      else e.setAttribute(k, v);
    });
    children.flat().forEach((c) => {
      if (c == null) return;
      e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return e;
  }

  let debounceTimer = null;
  function scheduleUpdate() {
    if (debounceTimer) cancelAnimationFrame(debounceTimer);
    debounceTimer = requestAnimationFrame(update);
  }

  function numberInput(label, id, value, attrs = {}) {
    const input = el("input", { type: "number", id, value: String(value), ...attrs });
    input.addEventListener("change", scheduleUpdate);
    input.addEventListener("input", scheduleUpdate);
    return el("div", { class: "input-group" }, el("label", { for: id }, label), input);
  }

  function rangeInput(label, id, min, max, value) {
    const valSpan = el("span", { class: "range-value", id: id + "_val" }, String(value));
    const input = el("input", {
      type: "range", id, min: String(min), max: String(max), value: String(value),
    });
    input.addEventListener("input", () => {
      valSpan.textContent = input.value;
      scheduleUpdate();
    });
    const labelEl = el("label", { for: id }, label, valSpan);
    return el("div", { class: "input-group" }, labelEl, input);
  }

  // --- Build page ---

  function buildPage() {
    const sidebar = el("aside", { class: "sidebar" },
      el("h2", null, "Financial Inputs"),
      numberInput("Annual Base Salary ($)", "salary", DEFAULTS.salary, { step: "5000" }),
      numberInput("Remaining 401k Limit ($)", "remLimit", DEFAULTS.remLimit, { step: "1" }),
      numberInput("Remaining Paychecks", "remPays", DEFAULTS.remPays, { min: "1", max: "26" }),
      el("hr"),
      el("h2", null, "Strategy Settings"),
      rangeInput("Number of Front-Load Pays", "frontLoadPays", 0, DEFAULTS.remPays, DEFAULTS.frontLoadPays),
      rangeInput("Max Front-Load % per Check", "maxCheckPct", 10, 90, DEFAULTS.maxCheckPct),
      el("hr"),
      el("h2", null, "Company Match Rules"),
      numberInput("Company Match Cap %", "matchCapPct", DEFAULTS.matchCapPct, { step: "0.5" }),
      numberInput("Company Match Rate %", "matchRate", DEFAULTS.matchRate, { step: "5" }),
      el("p", { class: "footnote" },
        "This tool is optimized for Google Chrome.",
        el("br"),
        `\u00A9 ${new Date().getFullYear()} All rights reserved.`,
      ),
    );

    const main = el("div", { class: "main" },
      el("h1", null, "401k Front-Load Contribution Planner"),
      el("p", { class: "subtitle" },
        "Maximize early tax savings by front-loading 401k contributions, then ease back to secure the full company match for the rest of the year."
      ),
      el("div", { class: "metrics", id: "metrics" }),
      el("div", { id: "chart" }),
      el("h2", { class: "section" }, "Detailed Schedule ($1 Units)"),
      el("div", { id: "tables" }),
      el("div", { id: "execPlan" }),
    );

    document.body.appendChild(sidebar);
    document.body.appendChild(main);
  }

  // --- Render ---

  function fmt(n) {
    return n.toLocaleString("en-US");
  }

  function getVal(id) {
    return parseFloat(document.getElementById(id).value) || 0;
  }

  function update() {
    const salary = getVal("salary");
    const remLimit = getVal("remLimit");
    let remPays = Math.max(1, Math.min(26, Math.trunc(getVal("remPays"))));
    const frontLoadPays = Math.trunc(getVal("frontLoadPays"));
    const maxCheckPct = getVal("maxCheckPct");
    const matchCapPct = getVal("matchCapPct");

    const slider = document.getElementById("frontLoadPays");
    if (parseInt(slider.max) !== remPays) {
      slider.max = String(remPays);
      if (frontLoadPays > remPays) {
        slider.value = String(remPays);
        document.getElementById("frontLoadPays_val").textContent = String(remPays);
      }
    }

    const { schedule, restPer } = calculateStrategy(
      remLimit, remPays, salary, maxCheckPct, matchCapPct, frontLoadPays
    );

    const totalPlanned = schedule.reduce((a, b) => a + b, 0);
    const shortfall = Math.trunc(remLimit) - totalPlanned;
    const hitLimit = shortfall === 0;

    renderMetrics(schedule, restPer, totalPlanned, shortfall);
    renderChart(schedule, frontLoadPays);
    renderTables(schedule, remLimit, hitLimit);
    renderExecPlan(schedule, frontLoadPays, restPer, totalPlanned, shortfall, hitLimit);
  }

  function renderMetrics(schedule, restPer, totalPlanned, shortfall) {
    const container = document.getElementById("metrics");
    container.innerHTML = "";

    const cards = [
      { label: "Front Load per Check", value: `$${fmt(schedule[0])}` },
      { label: "Rest per Check", value: `$${fmt(restPer)}` },
      {
        label: "Total Planned Contribution",
        value: `$${fmt(totalPlanned)}`,
        delta: shortfall > 0 ? `-$${fmt(shortfall)} from cap` : null,
      },
    ];

    cards.forEach((c) => {
      const children = [
        el("div", { class: "label" }, c.label),
        el("div", { class: "value" }, c.value),
      ];
      if (c.delta) children.push(el("div", { class: "delta" }, c.delta));
      container.appendChild(el("div", { class: "metric-card" }, ...children));
    });
  }

  function renderChart(schedule, frontLoadPays) {
    const labels = schedule.map((_, i) => `Pay ${i + 1}`);
    const cumulative = [];
    schedule.reduce((sum, v, i) => { cumulative[i] = sum + v; return cumulative[i]; }, 0);

    const bar = {
      x: labels, y: schedule, name: "Contribution ($)", type: "bar",
      marker: { color: "#008080" },
    };
    const line = {
      x: labels, y: cumulative, name: "Running Total", type: "scatter",
      yaxis: "y2", line: { color: "#00cccc", width: 3 },
    };

    const layout = {
      title: `Strategy: ${frontLoadPays} Front-Load Pays, then Rest`,
      height: 450,
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      font: { color: "#e8f0f0", family: "Inter, sans-serif" },
      yaxis: {
        title: "Contribution ($)", gridcolor: "rgba(0,128,128,0.15)",
        nticks: 8, rangemode: "tozero", tickformat: ",d",
      },
      yaxis2: {
        title: "Cumulative Total ($)", overlaying: "y", side: "right",
        showgrid: false, nticks: 8, rangemode: "tozero", tickformat: ",d",
      },
      hovermode: "x unified",
      hoverlabel: { bgcolor: "#101a1d", bordercolor: "rgba(0,128,128,0.3)", font: { color: "#e8f0f0" } },
      legend: { orientation: "h", yanchor: "bottom", y: 1.02, xanchor: "right", x: 1 },
      margin: { t: 80, b: 40, l: 60, r: 75 },
    };

    const chartEl = document.getElementById("chart");
    Plotly.purge(chartEl);
    Plotly.newPlot(chartEl, [bar, line], layout, { responsive: true, displayModeBar: false });
  }

  function renderTables(schedule, remLimit, hitLimit) {
    const container = document.getElementById("tables");
    container.innerHTML = "";

    const labels = schedule.map((_, i) => `Pay ${i + 1}`);
    const cumulative = [];
    schedule.reduce((sum, v, i) => { cumulative[i] = sum + v; return cumulative[i]; }, 0);

    const highlightColor = hitLimit ? "var(--green)" : "var(--red)";
    const lastIdx = schedule.length - 1;

    for (let start = 0; start < schedule.length; start += PAYS_PER_ROW) {
      const end = Math.min(start + PAYS_PER_ROW, schedule.length);

      const headerCells = [el("th", { style: "width:160px;min-width:160px" }, "")];
      for (let i = start; i < end; i++) headerCells.push(el("th", null, labels[i]));

      const contribCells = [el("td", { class: "row-label" }, "Contribution ($)")];
      for (let i = start; i < end; i++) contribCells.push(el("td", null, fmt(schedule[i])));

      const cumulCells = [el("td", { class: "row-label" }, "Cumulative Total ($)")];
      for (let i = start; i < end; i++) {
        const td = el("td", null, fmt(cumulative[i]));
        if (i === lastIdx) {
          td.style.backgroundColor = highlightColor;
          td.style.color = "white";
          td.style.fontWeight = "bold";
        }
        cumulCells.push(td);
      }

      const table = el("table", { class: "schedule-table" },
        el("thead", null, el("tr", null, ...headerCells)),
        el("tbody", null,
          el("tr", null, ...contribCells),
          el("tr", null, ...cumulCells),
        ),
      );
      container.appendChild(table);
    }
  }

  function renderExecPlan(schedule, frontLoadPays, restPer, totalPlanned, shortfall, hitLimit) {
    const container = document.getElementById("execPlan");
    container.innerHTML = "";

    const cls = hitLimit ? "exec-plan success" : "exec-plan error";
    const html =
      `<strong>Uniform Execution Plan:</strong><br>` +
      `1. <strong>Front Load</strong> — Set contribution to <strong>$${fmt(schedule[0])}</strong> ` +
      `for the first <strong>${frontLoadPays}</strong> paychecks (maximize tax benefit).<br>` +
      `2. <strong>Rest</strong> — After the ${frontLoadPays}th paycheck, change it to ` +
      `<strong>$${fmt(restPer)}</strong> for the remaining paychecks ` +
      `(guarantees full company match).<br><br>` +
      `<em>Total Year Contribution:</em> <strong>$${fmt(totalPlanned)}</strong> ` +
      `<em>(Leaving $${fmt(shortfall)} unused to maintain perfectly identical checks).</em>`;

    const div = el("div", { class: cls });
    div.innerHTML = html;
    container.appendChild(div);
  }

  // --- Init ---

  function init() {
    injectStyles();
    buildPage();
    update();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
