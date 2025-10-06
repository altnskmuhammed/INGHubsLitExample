import { LitElement, html, css } from 'lit';
import './icon-button.js';

export class EmployeeHeader extends LitElement {
  static properties = {
    view: { type: String },
  };

  static styles = css`
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');

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

    /* Aktif buton arka planı */
    icon-button.active::part(button) {
      color: rgba(255, 170, 0, 0.15);
      transform: scale(1.05);
    }
  `;

  render() {
    return html`
      <div class="header">
        <h2>Employee List</h2>
        <div class="view-toggle">
          <icon-button
            icon="menu"
            title="List View"
            color=${this.view === 'list' ? 'darkorange' : 'orange'}
            class=${this.view === 'list' ? 'active' : ''}
            @icon-click=${() => this._change('list')}
          ></icon-button>

          <icon-button
            icon="grid_view"
            title="Grid View"
            color=${this.view === 'grid' ? 'darkorange' : 'orange'}
            class=${this.view === 'grid' ? 'active' : ''}
            @icon-click=${() => this._change('grid')}
          ></icon-button>
        </div>
      </div>
    `;
  }

  _change(view) {
    this.view = view;
    this.dispatchEvent(new CustomEvent('view-change', { detail: view }));
  }
}

customElements.define('employee-header', EmployeeHeader);
