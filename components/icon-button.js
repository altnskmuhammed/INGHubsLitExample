import { LitElement, html, css } from 'lit';

export class IconButton extends LitElement {
  static properties = {
    icon: { type: String },
    title: { type: String },
    color: { type: String },
    text:{type:String}
  };

  static styles = css`
    button {
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 22px;
      padding: 6px;
      border-radius: 6px;
      transition: background 0.12s, transform 0.08s;
      display: flex;
      align-items: center;
      justify-content: center;
      color:white;
    }

    button:hover {
      background: rgba(0,0,0,0.04);
    }

    .material-symbols-outlined {
      font-family: 'Material Symbols Outlined';
      font-size: 26px;
      line-height: 1;
      -webkit-font-smoothing: antialiased;
    }
  `;

  render() {
    return html`
      <button part="button" @click=${this._onClick} title=${this.title} text=${this.text}>
        <span
          class="material-symbols-outlined"
          style="color: ${this.color || 'white'}"
        >
          ${this.icon}
        </span>
        ${this.text}
      </button>
    `;
  }

  _onClick() {
    this.dispatchEvent(
      new CustomEvent('icon-click', {
        bubbles: true,
        composed: true,
        detail: { icon: this.icon },
      })
    );
  }
}

customElements.define('icon-button', IconButton);
