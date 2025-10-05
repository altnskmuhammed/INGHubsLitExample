import { LitElement, html, css } from 'lit';

export class EmployeeHeader extends LitElement {
  static properties = {
    view: { type: String },
  };
  static shadowRootOptions = { ...LitElement.shadowRootOptions, mode: 'open', delegatesFocus: true };

  static styles = css`
    @import url('https://fonts.googleapis.com/icon?family=Material+Icons');

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      margin-top: 20px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
      margin-bottom: 8px;
    }

    h2 {
      margin: 0;
      font-size: 22px;
      font-weight: bold;
      color: orange;
    }

    .view-toggle {
      display: flex;
      gap: 8px;
    }

    .view-toggle button {
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 20px;
      padding: 4px;
      border-radius: 6px;
      transition: background 0.2s;
    }

    .view-toggle button:hover {
      background: #f0f0f0;
    }
  `;



  render() {
    return html`
      <div class="header">
        <h2>Employee List</h2>
        <div class="view-toggle">
        <button @click=${() => this._change('list')} title="List View">
        <span class="material-symbols-outlined">
menu
</span>
        </button>
        <button @click=${() => this._change('grid')} title="Grid View">
          <span class="material-icons">grid_view</span>
        </button>
      </div>

      </div>
    `;
  }

  _change(view) {
    this.dispatchEvent(new CustomEvent('view-change', { detail: view }));
  }
}

customElements.define('employee-header', EmployeeHeader);
