import { LitElement, html, css } from 'lit';
// Örn: store import et
 import { employeeStore } from '../store/employeeStore.js';

class EmployeeList extends LitElement {
  static properties = {
    page: { type: Number },
    query: { type: String },
  };

  static styles = css`
    :host {
      display: block;
      padding: 24px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th,
    td {
      padding: 16px;
      border: 1px solid #ddd;
    }
    .controls {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }
  `;

  constructor() {
    super();
    this._employees = [];
    this.pageSize = 8;
    this.page = 1;
    this.query = '';
  }

  connectedCallback() {
    super.connectedCallback();
    this._unsub = employeeStore.subscribe((data) => {
      this._employees = data;
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    this._unsub && this._unsub();
    super.disconnectedCallback();
  }

  render() {
    const filtered = this._employees.filter((e) => {
      const q = this.query.trim().toLowerCase();
      if (!q) return true;
      return (
        [e.firstName, e.lastName, e.email, e.department, e.position]
          .join(' ')
          .toLowerCase()
          .includes(q)
      );
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / this.pageSize));
    const start = (this.page - 1) * this.pageSize;
    const pageItems = filtered.slice(start, start + this.pageSize);

    return html`
      <div class="controls">
        <input
          placeholder="Ara isim veya email"
          @input=${this._onSearch}
        />
        <button @click=${() => (location.href = '/add')}>Add New</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>First</th>
            <th>Last</th>
            <th>Email</th>
            <th>Dept</th>
            <th>Pos</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${pageItems.map(
            (e) => html`<tr>
              <td>${e.firstName}</td>
              <td>${e.lastName}</td>
              <td>${e.email}</td>
              <td>${e.department}</td>
              <td>${e.position}</td>
              <td>
                <button @click=${() => this._onEdit(e.id)}>Edit</button>
                <button @click=${() => this._onDelete(e.id)}>Delete</button>
              </td>
            </tr>`
          )}
        </tbody>
      </table>
      <div style="margin-top:8px">
        Page ${this.page} / ${totalPages}
        <button
          ?disabled=${this.page <= 1}
          @click=${() => this._goto(this.page - 1)}
        >
          Prev
        </button>
        <button
          ?disabled=${this.page >= totalPages}
          @click=${() => this._goto(this.page + 1)}
        >
          Next
        </button>
      </div>
    `;
  }

  _onSearch(e) {
    this.query = e.target.value;
    this.page = 1;
  }

  _goto(p) {
    this.page = p;
  }

  _onEdit(id) {
    window.history.pushState({}, '', `/edit/${id}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
  

  async _onDelete(id) {
    const confirmed = confirm('Delete this record?');
    if (!confirmed) return;
    employeeStore.remove(id);
  }
}

customElements.define('employee-list', EmployeeList);
