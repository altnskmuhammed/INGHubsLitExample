import { LitElement, html, css } from 'lit';

export class EmployeeGrid extends LitElement {
  static properties = {
    items: { type: Array },
  };

  static styles = css`
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 12px;
      padding: 8px;
    }

    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 12px;
      background: #fff;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
    }

    .actions {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
    }

    button {
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 18px;
    }
  `;

  render() {
    return html`
      <div class="grid">
        ${this.items.map(
          (e) => html`
            <div class="card">
              <h3>${e.firstName} ${e.lastName}</h3>
              <p>${e.department} - ${e.position}</p>
              <p>${e.emailAddress}</p>
              <div class="actions">
                <button @click=${() => this._edit(e.id)}>✏️</button>
                <button @click=${() => this._delete(e.id)}>🗑️</button>
              </div>
            </div>
          `
        )}
      </div>
    `;
  }

  _edit(id) {
    this.dispatchEvent(new CustomEvent('edit', { detail: id }));
  }

  _delete(id) {
    this.dispatchEvent(new CustomEvent('delete', { detail: id }));
  }
}

customElements.define('employee-grid', EmployeeGrid);
