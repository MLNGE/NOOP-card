const DEFAULT_METRICS = {
  charge: "sensor.noop_tim_noop_charge",
  effort: "sensor.noop_tim_daily_effort",
  rest: "sensor.noop_tim_noop_rest",
  battery: "sensor.noop_b3207b93_5202_419c_a6c0_13a6eb61cd92_noop_battery",
  steps: "sensor.noop_b3207b93_5202_419c_a6c0_13a6eb61cd92_noop_steps",
  sync: "sensor.noop_tim_noop_charge",
};

const METRIC_DEFINITIONS = [
  { key: "charge", label: "Charge", className: "charge" },
  { key: "effort", label: "Effort", className: "effort" },
  { key: "rest", label: "Rest", className: "rest" },
];

const NOOP_ENTITY_SELECTOR = { entity: { domain: "sensor", integration: "noop_push" } };

const styles = `
  :host {
    display: block;
    --noop-card-background: var(--ha-card-background, var(--card-background-color, #192b40));
    --noop-card-text: var(--primary-text-color, #f8fafc);
    --noop-card-muted: var(--secondary-text-color, #aeb9c8);
    --noop-card-radius: 24px;
  }

  .card {
    box-sizing: border-box;
    min-height: 0;
    padding: 10px 18px 9px;
    overflow: hidden;
    color: var(--noop-card-text);
    background: var(--noop-card-background);
    border: 1px solid color-mix(in srgb, var(--primary-color, #5ca9ff) 70%, transparent);
    border-radius: var(--noop-card-radius);
    box-shadow: var(--ha-card-box-shadow, 0 2px 6px rgb(0 0 0 / 20%));
  }

  .metrics {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: clamp(8px, 4vw, 32px);
    align-items: start;
  }

  .metric {
    min-width: 0;
    text-align: center;
  }

  .circle {
    --metric-color: #c56b36;
    position: relative;
    display: grid;
    width: clamp(58px, 11vw, 92px);
    aspect-ratio: 1;
    margin: 0 auto 4px;
    place-items: center;
    overflow: hidden;
    border-radius: 50%;
    background:
      radial-gradient(circle at 50% 0%, rgb(255 255 255 / 7%), transparent 46%),
      #101c2d;
    box-shadow:
      inset 0 0 0 1px rgb(255 255 255 / 16%),
      inset 0 -10px 14px rgb(0 0 0 / 28%);
  }

  .circle.charge { --metric-color: var(--noop-charge, #c56b36); }
  .circle.effort { --metric-color: var(--noop-effort, #b77724); }
  .circle.rest { --metric-color: var(--noop-rest, #20af6d); }

  .fill {
    --wave-deep: color-mix(in srgb, black 18%, var(--metric-color));
    --wave-mid: var(--metric-color);
    --wave-top: color-mix(in srgb, white 24%, var(--metric-color));
    position: absolute;
    right: -14%;
    bottom: 0;
    left: -14%;
    z-index: 0;
    height: var(--fill-height);
    background: linear-gradient(180deg, var(--wave-top) 0%, var(--wave-mid) 46%, var(--wave-deep) 100%);
    transition: height 700ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .fill::before,
  .fill::after {
    content: "";
    position: absolute;
    left: 0;
    height: 16px;
    pointer-events: none;
    background: var(--wave-top);
    -webkit-mask-repeat: repeat-x;
    mask-repeat: repeat-x;
    -webkit-mask-position: left bottom;
    mask-position: left bottom;
    animation: noop-wave linear infinite;
  }

  .fill::before {
    --wave-shift: -96px;
    top: -5px;
    width: calc(96px * 6);
    background: color-mix(in srgb, white 8%, var(--metric-color));
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 16'%3E%3Cpath fill='%23000' d='M0 9C12 9 12 6 24 6C36 6 36 9 48 9C60 9 60 12 72 12C84 12 84 9 96 9V16H0Z'/%3E%3C/svg%3E");
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 16'%3E%3Cpath fill='%23000' d='M0 9C12 9 12 6 24 6C36 6 36 9 48 9C60 9 60 12 72 12C84 12 84 9 96 9V16H0Z'/%3E%3C/svg%3E");
    -webkit-mask-size: 96px 16px;
    mask-size: 96px 16px;
    animation-duration: 6.4s;
  }

  .fill::after {
    --wave-shift: -64px;
    top: -8px;
    width: calc(64px * 8);
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 16'%3E%3Cpath fill='%23000' d='M0 9C8 9 8 3 16 3C24 3 24 9 32 9C40 9 40 14 48 14C56 14 56 9 64 9V16H0Z'/%3E%3C/svg%3E");
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 16'%3E%3Cpath fill='%23000' d='M0 9C8 9 8 3 16 3C24 3 24 9 32 9C40 9 40 14 48 14C56 14 56 9 64 9V16H0Z'/%3E%3C/svg%3E");
    -webkit-mask-size: 64px 16px;
    mask-size: 64px 16px;
    animation-duration: 3.8s;
    animation-direction: reverse;
  }

  .circle.is-empty .fill::before,
  .circle.is-empty .fill::after {
    display: none;
  }

  .circle::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    border-radius: inherit;
    background:
      radial-gradient(90% 55% at 30% 16%, rgb(255 255 255 / 24%), transparent 46%),
      radial-gradient(80% 40% at 50% 118%, rgb(0 0 0 / 22%), transparent 52%);
    pointer-events: none;
  }

  @keyframes noop-wave {
    from { transform: translate3d(0, 0, 0); }
    to { transform: translate3d(var(--wave-shift), 0, 0); }
  }

  .value {
    position: relative;
    z-index: 2;
    font-size: clamp(1.35rem, 3.2vw, 1.9rem);
    font-weight: 700;
    line-height: 1;
    text-shadow: 0 1px 2px rgb(0 0 0 / 40%);
  }

  .label {
    color: var(--noop-card-muted);
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .details {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: clamp(8px, 4vw, 32px);
    margin-top: 8px;
    color: var(--noop-card-muted);
    font-size: 0.68rem;
    text-align: center;
  }

  .detail {
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    white-space: nowrap;
  }

  .detail strong {
    display: block;
    overflow: hidden;
    color: var(--noop-card-text);
    font-size: 0.78rem;
    font-weight: 600;
    text-overflow: ellipsis;
  }

  .error {
    color: var(--error-color, #ffb4ab);
    line-height: 1.4;
  }

  @media (prefers-reduced-motion: reduce) {
    .fill { transition: none; }
    .fill::before,
    .fill::after { animation: none; }
  }

  @media (max-width: 420px) {
    .card { padding-inline: 10px; }
    .details { gap: 3px; font-size: 0.62rem; }
    .detail strong { font-size: 0.72rem; }
  }
`;

function isUnavailable(state) {
  return !state || ["unavailable", "unknown"].includes(state.state);
}

function formatValue(state, fallback = "—") {
  if (isUnavailable(state)) return fallback;
  const value = Number(state.state);
  if (!Number.isFinite(value)) return state.state;
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function metricPercentage(state) {
  if (isUnavailable(state)) return 0;
  const value = Number(state.state);
  return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
}

function formatBattery(state) {
  if (isUnavailable(state)) return "—";
  const value = Number(state.state);
  return Number.isFinite(value) ? `${Math.round(value)}%` : state.state;
}

function formatSteps(state) {
  if (isUnavailable(state)) return "—";
  const value = Number(state.state);
  return Number.isFinite(value) ? Math.round(value).toLocaleString() : state.state;
}

function relativeTime(timestamp, now = Date.now()) {
  if (!timestamp) return "Unknown";
  const time = Date.parse(timestamp);
  if (!Number.isFinite(time)) return "Unknown";
  const seconds = Math.max(0, Math.floor((now - time) / 1000));
  if (seconds < 10) return "Just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

class NoopCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement("noop-card-editor");
  }

  static getStubConfig() {
    return {
      entity: DEFAULT_METRICS.charge,
    };
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = null;
    this._hass = null;
    this._refreshTimer = null;
    this._resolved = null;
    this._signature = "";
    this._mounted = false;
  }

  setConfig(config) {
    if (!config || typeof config !== "object") {
      throw new Error("NOOP Card requires a configuration object.");
    }
    if (!config.entity && !config.entities) {
      throw new Error("NOOP Card requires an entity or entities configuration.");
    }
    this._config = {
      ...config,
      entities: { ...(config.entities || {}) },
    };
    this._resolved = null;
    this._signature = "";
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  getCardSize() {
    return 2;
  }

  connectedCallback() {
    if (this._config) this._ensureRefresh();
  }

  disconnectedCallback() {
    this._stopRefresh();
  }

  _ensureRefresh() {
    if (this._refreshTimer !== null) return;
    this._refreshTimer = window.setInterval(() => {
      this._signature = "";
      this._render();
    }, 30000);
  }

  _stopRefresh() {
    if (this._refreshTimer !== null) {
      window.clearInterval(this._refreshTimer);
      this._refreshTimer = null;
    }
  }

  _entityId(key) {
    if (!this._lookup) this._lookup = this._resolved || this._resolveEntities();
    return this._lookup[key];
  }

  _resolveEntities() {
    const configured = this._config?.entities || {};
    const states = this._hass?.states || {};
    const tokenCandidates = {
      effort: ["daily_effort", "effort"],
      rest: ["noop_rest", "_rest"],
      battery: ["_battery", "battery"],
      steps: ["_steps", "steps"],
      sync: ["charge", "effort", "rest"],
    };
    const resolved = {};
    const pending = [];

    for (const key of Object.keys(DEFAULT_METRICS)) {
      if (configured[key]) {
        resolved[key] = configured[key];
      } else if (key === "charge" && this._config?.entity) {
        resolved[key] = this._config.entity;
      } else {
        pending.push(key);
      }
    }

    if (pending.length) {
      const searchable = pending.filter((key) => key !== "sync");
      const found = Object.fromEntries(searchable.map((key) => [key, null]));
      for (const entityId of Object.keys(states)) {
        const normalized = entityId.toLowerCase();
        if (!normalized.includes("noop")) continue;
        for (const key of searchable) {
          if (found[key]) continue;
          if ((tokenCandidates[key] || []).some((token) => normalized.endsWith(token) || normalized.includes(token))) {
            found[key] = entityId;
          }
        }
      }
      for (const key of searchable) resolved[key] = found[key] || DEFAULT_METRICS[key];
      if (pending.includes("sync")) {
        resolved.sync = resolved.charge || DEFAULT_METRICS.charge;
      }
    }

    const complete = Object.values(resolved).every((entityId) => states[entityId]);
    if (complete || !pending.length) this._resolved = resolved;
    return resolved;
  }

  _findState(key) {
    const entityId = this._entityId(key);
    if (!entityId || !this._hass?.states) return null;
    return this._hass.states[entityId] || null;
  }

  _mount() {
    const metrics = METRIC_DEFINITIONS.map(({ key, label, className }) => `
      <div class="metric">
        <div class="circle ${className}" data-metric="${key}">
          <div class="fill"></div>
          <span class="value"></span>
        </div>
        <div class="label">${label}</div>
      </div>
    `).join("");

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <ha-card class="card">
        <div class="error" hidden></div>
        <div class="body">
          <div class="metrics">${metrics}</div>
          <div class="details">
            <div class="detail">Last sync<strong data-field="sync"></strong></div>
            <div class="detail">Battery<strong data-field="battery"></strong></div>
            <div class="detail">Steps<strong data-field="steps"></strong></div>
          </div>
        </div>
      </ha-card>
    `;

    this._els = {
      error: this.shadowRoot.querySelector(".error"),
      body: this.shadowRoot.querySelector(".body"),
      sync: this.shadowRoot.querySelector("[data-field=sync]"),
      battery: this.shadowRoot.querySelector("[data-field=battery]"),
      steps: this.shadowRoot.querySelector("[data-field=steps]"),
      metrics: {},
    };
    for (const { key } of METRIC_DEFINITIONS) {
      const circle = this.shadowRoot.querySelector(`[data-metric="${key}"]`);
      this._els.metrics[key] = {
        circle,
        value: circle.querySelector(".value"),
      };
    }
    this._mounted = true;
    this._signature = "";
  }

  _render() {
    if (!this.shadowRoot || !this._config) return;
    this._lookup = null;
    this._ensureRefresh();
    if (!this._mounted) this._mount();

    const states = {
      charge: this._findState("charge"),
      effort: this._findState("effort"),
      rest: this._findState("rest"),
      battery: this._findState("battery"),
      steps: this._findState("steps"),
      sync: this._findState("sync"),
    };
    const missing = Object.entries(states)
      .filter(([, state]) => !state)
      .map(([key]) => this._entityId(key));

    if (missing.length) {
      const message = `NOOP Card could not find: ${missing.join(", ")}`;
      if (this._signature !== `error:${message}`) {
        this._els.error.hidden = false;
        this._els.error.textContent = message;
        this._els.body.hidden = true;
        this._signature = `error:${message}`;
      }
      this._resolved = null;
      return;
    }

    const view = {
      charge: formatValue(states.charge),
      effort: formatValue(states.effort),
      rest: formatValue(states.rest),
      chargePct: metricPercentage(states.charge),
      effortPct: metricPercentage(states.effort),
      restPct: metricPercentage(states.rest),
      sync: relativeTime(states.sync.last_reported || states.sync.last_updated),
      battery: formatBattery(states.battery),
      steps: formatSteps(states.steps),
    };
    const signature = JSON.stringify(view);
    if (signature === this._signature) return;

    this._els.error.hidden = true;
    this._els.body.hidden = false;
    for (const { key } of METRIC_DEFINITIONS) {
      const metric = this._els.metrics[key];
      const percent = view[`${key}Pct`];
      metric.circle.style.setProperty("--fill-height", `${percent}%`);
      metric.circle.classList.toggle("is-empty", percent === 0);
      if (metric.value.textContent !== view[key]) metric.value.textContent = view[key];
    }
    this._els.sync.textContent = view.sync;
    this._els.battery.textContent = view.battery;
    this._els.steps.textContent = view.steps;
    this._signature = signature;
  }
}

customElements.define("noop-card", NoopCard);

class NoopCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
    this._handleValueChanged = (event) => this._valueChanged(event);
    this._schema = [
      {
        name: "entity",
        label: "Primary NOOP entity",
        selector: NOOP_ENTITY_SELECTOR,
      },
      {
        name: "charge",
        label: "Charge entity",
        selector: NOOP_ENTITY_SELECTOR,
      },
      {
        name: "effort",
        label: "Effort entity",
        selector: NOOP_ENTITY_SELECTOR,
      },
      {
        name: "rest",
        label: "Rest entity",
        selector: NOOP_ENTITY_SELECTOR,
      },
      {
        name: "battery",
        label: "Battery entity",
        selector: NOOP_ENTITY_SELECTOR,
      },
      {
        name: "steps",
        label: "Steps entity",
        selector: NOOP_ENTITY_SELECTOR,
      },
      {
        name: "sync",
        label: "Sync entity",
        selector: NOOP_ENTITY_SELECTOR,
      },
    ];
  }

  setConfig(config) {
    const entities = config.entities || {};
    this._config = {
      ...config,
      charge: entities.charge || "",
      effort: entities.effort || "",
      rest: entities.rest || "",
      battery: entities.battery || "",
      steps: entities.steps || "",
      sync: entities.sync || "",
    };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _render() {
    const form = this.shadowRoot.querySelector("ha-form");
    if (!form) {
      this.shadowRoot.innerHTML = `
        <style>
          ha-form { display: block; padding: 8px 0; }
        </style>
        <ha-form></ha-form>
      `;
    }

    const currentForm = this.shadowRoot.querySelector("ha-form");
    currentForm.hass = this._hass;
    currentForm.schema = this._schema;
    currentForm.data = this._config;
    currentForm.computeLabel = (schema) => schema.label;
    if (!currentForm.hasAttribute("data-noop-listener")) {
      currentForm.addEventListener("value-changed", this._handleValueChanged);
      currentForm.setAttribute("data-noop-listener", "");
    }
  }

  _valueChanged(event) {
    const value = event.detail.value || {};
    const entities = {};
    for (const key of ["charge", "effort", "rest", "battery", "steps", "sync"]) {
      if (value[key]) entities[key] = value[key];
    }

    const config = {
      type: "custom:noop-card",
      entity: value.entity || undefined,
      entities,
    };
    this._config = { ...value, entities };
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config },
      bubbles: true,
      composed: true,
    }));
    this._render();
  }
}

customElements.define("noop-card-editor", NoopCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "noop-card",
  name: "NOOP Metrics Card",
  description: "A compact, wide card for NOOP health metrics.",
  preview: true,
});
