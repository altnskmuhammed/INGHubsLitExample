import { LitElement, html, css } from 'lit';

export class EmployeeControls extends LitElement {
  static properties = {
    selectedCount: { type: Number },
  };

  static styles = css`
    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 8px;
      padding: 0 8px;
    }

    input {
      flex: 1;
      min-width: 200px;
      padding: 6px 10px;
      border-radius: 6px;
      border: 1px solid #ccc;
      font-size: 14px;
    }

    button {
      background: orange;
      border: none;
      color: #fff;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
    }

    button:hover {
      opacity: 0.9;
    }
  `;

  render() {
    return html`
      <div class="controls">
        <input
          type="text"
          placeholder="Search employees..."
          @input=${this._onSearch}
        />
        ${this.selectedCount > 0
          ? html`
              <button @click=${this._deleteSelected}>
                Delete Selected (${this.selectedCount})
              </button>
            `
          : ''}
      </div>
    `;
  }

  _onSearch(e) {
    this.dispatchEvent(
      new CustomEvent('search', { detail: e.target.value })
    );
  }

  _deleteSelected() {
    this.dispatchEvent(new CustomEvent('delete-selected'));
  }
}

customElements.define('employee-controls', EmployeeControls);
