import { LitElement, html, css } from 'lit';
import { employeeStore } from '../store/employeeStore.js';

class EmployeeList extends LitElement {
  static properties = {
    page: { type: Number },
    query: { type: String },
    selected: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      padding: 16px;
    }

    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 12px;
    }

    table {
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      background: #ffffff;
      border-collapse: collapse;
    }

    thead {
      background-color: #f8f8f8;
    }

    th, td {
      text-align: center;
      padding: 8px;
      font-size: 14px;
    }

    th {
      color: orange;
      border-bottom: 2px solid #ccc;
    }

    td {
      border-bottom: 1px solid #eee;
    }

    tr:hover td {
      background: #fafafa;
    }

    .actions {
      display: flex;
      justify-content: center;
      gap: 0.5em;
    }

    .actions button {
      padding: 0.5em 1em;
      border-radius: 0.5em;
      border: 1px solid #ddd;
      cursor: pointer;
    }

    /* --- Responsive --- */
    @media (max-width: 768px) {
      table, thead, tbody, th, td, tr {
        display: block;
        width: 100%;
        font-size:10px
      }

      thead {
        display: none; /* başlık gizleniyor */
      }

      tr {
        margin-bottom: 12px;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 8px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }

      td {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 8px;
        border: none;
      }

      td::before {
        content: attr(data-label);
        font-weight: bold;
        color: #555;
        flex: 1;
        text-align: left;
      }

      td:last-child {
        justify-content: center;
      }
    }
  `;

  constructor() {
    super();
    this._employees = [];
    this.pageSize = 8;
    this.page = 1;
    this.query = '';
    this.selected = new Set();
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
        [e.firstName, e.lastName, e.emailAddress, e.department, e.position]
          .join(' ')
          .toLowerCase()
          .includes(q)
      );
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / this.pageSize));
    const start = (this.page - 1) * this.pageSize;
    const pageItems = filtered.slice(start, start + this.pageSize);

    const allSelected = pageItems.length > 0 && pageItems.every(e => this.selected.has(e.id));

    return html`
      <div class="controls">
        <input placeholder="Ara isim veya email" @input=${this._onSearch} />
        <button @click=${() => (location.href = '/add')}>Add New</button>
        <button ?disabled=${this.selected.size === 0} @click=${this._deleteSelected}>
          Delete Selected (${this.selected.size})
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th><input type="checkbox" .checked=${allSelected} @change=${(e) => this._toggleAll(e, pageItems)} /></th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date of Employment</th>
            <th>Date of Birth</th>
            <th>Phone Number</th>
            <th>Email Address</th>
            <th>Department</th>
            <th>Position</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${pageItems.map(
            (e) => html`
              <tr>
                <td data-label="Select">
                  <input type="checkbox" .checked=${this.selected.has(e.id)} @change=${(ev) => this._toggleOne(ev, e.id)} />
                </td>
                <td data-label="First Name">${e.firstName}</td>
                <td data-label="Last Name">${e.lastName}</td>
                <td data-label="Date of Employment">${e.dateOfEmployment}</td>
                <td data-label="Date of Birth">${e.dateOfBirth}</td>
                <td data-label="Phone Number">${e.phoneNumber}</td>
                <td data-label="Email">${e.emailAddress}</td>
                <td data-label="Department">${e.department}</td>
                <td data-label="Position">${e.position}</td>
                <td data-label="Actions" class="actions">
                  <button @click=${() => this._onEdit(e.id)}>Edit</button>
                  <button @click=${() => this._onDelete(e.id)}>Delete</button>
                </td>
              </tr>
            `
          )}
        </tbody>
      </table>

      <div style="margin-top:12px">
        Page ${this.page} / ${totalPages}
        <button ?disabled=${this.page <= 1} @click=${() => this._goto(this.page - 1)}>Prev</button>
        <button ?disabled=${this.page >= totalPages} @click=${() => this._goto(this.page + 1)}>Next</button>
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
    this.selected.delete(id);
  }

  _toggleOne(e, id) {
    if (e.target.checked) this.selected.add(id);
    else this.selected.delete(id);
    this.requestUpdate();
  }

  _toggleAll(e, items) {
    if (e.target.checked) items.forEach((emp) => this.selected.add(emp.id));
    else items.forEach((emp) => this.selected.delete(emp.id));
    this.requestUpdate();
  }

  _deleteSelected() {
    const confirmed = confirm(`Delete ${this.selected.size} selected records?`);
    if (!confirmed) return;
    [...this.selected].forEach((id) => employeeStore.remove(id));
    this.selected.clear();
  }
}

customElements.define('employee-list', EmployeeList);
