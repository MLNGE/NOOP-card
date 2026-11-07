class NoopCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
  }

  _render() {
    if (!this._config || this.shadowRoot) return;
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        p { color: var(--secondary-text-color); line-height: 1.4; }
        code { color: var(--primary-color); }
      </style>
      <p>Configure the NOOP card in YAML using an <code>entity</code> anchor and optional <code>entities</code> overrides.</p>
    `;
  }
}

customElements.define("noop-card-editor", NoopCardEditor);
