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
  border-radius: 8px;
  overflow: hidden; /* köşe radius düzgün çıksın diye */
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  background: #ffffff;
  padding:25;
}
th {
 color:orange;
  text-align: left;
  border-bottom: 2px solid #ccc;
} 
td {
  font-family:'arial' , 'sans-serif';
  font-size:1.3em;
 
}
.actions  {
  display:flex;
  font-family:'arial' , 'sans-serif';
  font-size:1.3em;
}
.actions button  {
  padding:1em;
  margin:0.5em;
  border-radius:1em;
  display:flex;
  font-family:'arial' , 'sans-serif';
  border: 2px solid #f5f1f1;
}
tr:hover td {
  background: #fafafa;
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
            (e) => html`<tr>
              <td>${e.firstName}</td>
              <td>${e.lastName}</td>
              <td>${e.email}</td>
              <td>${e.department}</td>
              <td>${e.position}</td>
              <td class="actions">
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
