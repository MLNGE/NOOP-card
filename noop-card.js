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
    position: relative;
    display: grid;
    width: clamp(58px, 11vw, 92px);
    aspect-ratio: 1;
    margin: 0 auto 4px;
    place-items: center;
    overflow: hidden;
    border: 1px solid rgb(255 255 255 / 12%);
    border-radius: 50%;
    background: #101c2d;
    box-shadow: inset 0 14px 20px rgb(0 0 0 / 20%);
  }

  .fill {
    position: absolute;
    right: -12%;
    bottom: 0;
    left: -12%;
    height: var(--fill-height);
    overflow: hidden;
    background: var(--metric-color);
    transition: height 600ms ease;
  }

  .fill::before,
  .fill::after {
    position: absolute;
    top: -7px;
    left: -30%;
    width: 160%;
    height: 14px;
    border-radius: 45%;
    background: rgb(255 255 255 / 18%);
    content: "";
    animation: noop-wave 4s ease-in-out infinite;
  }

  .fill::after {
    top: -3px;
    opacity: 0.45;
    animation-delay: -2s;
    animation-duration: 5.5s;
  }

  .sparkles {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 22% 30%, rgb(255 255 255 / 75%) 0 1px, transparent 1.8px),
      radial-gradient(circle at 70% 22%, rgb(255 255 255 / 55%) 0 1px, transparent 1.8px),
      radial-gradient(circle at 80% 66%, rgb(255 255 255 / 65%) 0 1px, transparent 1.8px),
      radial-gradient(circle at 38% 78%, rgb(255 255 255 / 45%) 0 1px, transparent 1.8px);
    animation: noop-sparkle 3s ease-in-out infinite alternate;
  }

  @keyframes noop-wave {
    0%, 100% { transform: translateX(-3%) rotate(1deg); }
    50% { transform: translateX(3%) rotate(-1deg); }
  }

  @keyframes noop-sparkle {
    0% { opacity: 0.25; transform: scale(0.96); }
    100% { opacity: 0.85; transform: scale(1.04); }
  }

  .value {
    position: relative;
    z-index: 1;
    font-size: clamp(1.35rem, 3.2vw, 1.9rem);
    font-weight: 700;
    line-height: 1;
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
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-top: 8px;
    color: var(--noop-card-muted);
    font-size: 0.68rem;
    text-align: center;
  }

  .detail {
    min-width: 0;
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
    .fill::before, .fill::after, .sparkles { animation: none; }
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
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  getCardSize() {
    return 2;
  }

  disconnectedCallback() {
    this._stopRefresh();
  }

  _startRefresh() {
    this._stopRefresh();
    this._refreshTimer = window.setInterval(() => this._render(), 30000);
  }

  _stopRefresh() {
    if (this._refreshTimer !== null) {
      window.clearInterval(this._refreshTimer);
      this._refreshTimer = null;
    }
  }

  _entityId(key) {
    if (this._config?.entities?.[key]) return this._config.entities[key];
    if (key === "charge") return this._config?.entity;
    return this._findRelatedEntity(key);
  }

  _findRelatedEntity(key) {
    const states = this._hass?.states || {};
    const tokenCandidates = {
      effort: ["daily_effort", "effort"],
      rest: ["noop_rest", "_rest"],
      battery: ["_battery", "battery"],
      steps: ["_steps", "steps"],
      sync: ["charge", "effort", "rest"],
    };
    const candidates = Object.keys(states).filter((entityId) => {
      const normalized = entityId.toLowerCase();
      return normalized.includes("noop") &&
        (tokenCandidates[key] || []).some((token) => normalized.endsWith(token) || normalized.includes(token));
    });
    return candidates[0] || DEFAULT_METRICS[key];
  }

  _findState(key) {
    const entityId = this._entityId(key);
    if (!entityId || !this._hass?.states) return null;
    return this._hass.states[entityId] || null;
  }

  _render() {
    if (!this.shadowRoot || !this._config) return;
    this._startRefresh();
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
      this.shadowRoot.innerHTML = `<style>${styles}</style><ha-card class="card"><div class="error">NOOP Card could not find: ${missing.join(", ")}</div></ha-card>`;
      return;
    }

    const metrics = METRIC_DEFINITIONS.map(({ key, label, className }) => `
      <div class="metric">
        <div class="circle" style="--metric-color: var(--noop-${className}, ${className === "rest" ? "#20af6d" : className === "effort" ? "#b77724" : "#c56b36"}); --fill-height: ${metricPercentage(states[key])}%">
          <div class="fill"><span class="sparkles"></span></div>
          <span class="value">${formatValue(states[key])}</span>
        </div>
        <div class="label">${label}</div>
      </div>
    `).join("");

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <ha-card class="card">
        <div class="metrics">${metrics}</div>
        <div class="details">
          <div class="detail">Last sync<strong>${relativeTime(states.sync.last_reported || states.sync.last_updated)}</strong></div>
          <div class="detail">Battery<strong>${formatBattery(states.battery)}</strong></div>
          <div class="detail">Steps<strong>${formatSteps(states.steps)}</strong></div>
        </div>
      </ha-card>
    `;
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
