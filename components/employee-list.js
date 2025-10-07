import { LitElement, html, css } from 'lit';
import { employeeStore } from '../store/employeeStore.js';
import './EmployeeHeader.js';
import './EmployeeControls.js';
import './EmployeeTable.js';
import './EmployeeGrid.js';

export class EmployeeList extends LitElement {
  static properties = {
    view: { type: String },
    page: { type: Number },
    query: { type: String },
    selected: { type: Object },
  };

  static styles = css`
   @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');
    :host {
      display: flex;
      flex-direction: column;
      height: 80vh; /* tam ekran yüksekliği */
      margin: 0;
      padding: 0;
      
    
    }

    employee-header,
    employee-controls {
      flex-shrink: 0;
    }

    .content-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden; /* scroll yok */
      position: relative;
    }

    .table-container {
      
      overflow: hidden; /* scroll yok */
      background:white;
    }

    .pagination {
      position: absolute;
      bottom: 15px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 6px;
      background: #fff;
      padding: 8px 12px;
      border-radius: 8px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
      font-family: sans-serif;
      font-size: 14px;
      z-index: 10;
    }

    .page-btn {
      border: none;
      background: #f3f3f3;
      padding: 6px 10px;
      border-radius: 50%;
      cursor: pointer;
      transition: 0.2s;
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 32px;
      height: 32px;
      font-weight: bold;
      color:orange;
    }

    .page-btn:hover {
      background: #e2e2e2;
    }

    .page-btn.active {
      background: orange;
      color: white;
    }

    .page-btn[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }

    span {
      display: flex;
      align-items: center;
      padding: 0 4px;
    }
  `;

  constructor() {
    super();
    this.view = 'list';
    this.page = 1;
    this.query = '';
    this.selected = new Set();
    this.pageSize = 8;
    this._employees = [];
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
    const filtered = this._employees.filter((e) =>
      Object.values(e).join(' ').toLowerCase().includes(this.query.toLowerCase())
    );
    const totalPages = Math.max(1, Math.ceil(filtered.length / this.pageSize));
    const start = (this.page - 1) * this.pageSize;
    const pageItems = filtered.slice(start, start + this.pageSize);

    return html`
      <employee-header
        .view=${this.view}
        @view-change=${(e) => (this.view = e.detail)}
      ></employee-header>

      <employee-controls
        .selectedCount=${this.selected.size}
        @search=${(e) => (this.query = e.detail)}
        @delete-selected=${this._deleteSelected}
      ></employee-controls>

      <div class="content-wrapper">
        <div class="table-container">
          ${this.view === 'list'
            ? html`
                <employee-table
                  .items=${pageItems}
                  .selected=${this.selected}
                  @toggle-one=${this._toggleOne}
                  @toggle-all=${this._toggleAll}
                  @delete=${(e) => this._onDelete(e.detail)}
                  @edit=${(e) => this._onEdit(e.detail)}
                ></employee-table>
              `
            : html`
                <employee-grid
                  .items=${pageItems}
                  @edit=${(e) => this._onEdit(e.detail)}
                  @delete=${(e) => this._onDelete(e.detail)}
                ></employee-grid>
              `}
        </div>

      
      </div>
      ${this._renderPagination(totalPages)}
    `;
  }

  _renderPagination(totalPages) {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, this.page - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    // Önceki sayfa
    pages.push(html`
      <button
        class="page-btn"
        ?disabled=${this.page === 1}
        @click=${() => (this.page = Math.max(1, this.page - 1))}
      >&lt;</button>
    `);

    // İlk sayfa ve "..."
    if (start > 1) {
      pages.push(html`
        <button class="page-btn" @click=${() => (this.page = 1)}>1</button>
      `);
      if (start > 2) pages.push(html`<span>...</span>`);
    }

    // Orta sayfalar
    for (let i = start; i <= end; i++) {
      pages.push(html`
        <button
          class="page-btn ${this.page === i ? 'active' : ''}"
          @click=${() => (this.page = i)}
        >
          ${i}
        </button>
      `);
    }

    // Son sayfa ve "..."
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(html`<span>...</span>`);
      pages.push(html`
        <button class="page-btn" @click=${() => (this.page = totalPages)}>
          ${totalPages}
        </button>
      `);
    }

    // Sonraki sayfa
    pages.push(html`
      <button
        class="page-btn"
        ?disabled=${this.page === totalPages}
        @click=${() => (this.page = Math.min(totalPages, this.page + 1))}
      >&gt;</button>
    `);

    return html`<div class="pagination">${pages}</div>`;
  }

  _toggleOne(e) {
    const { id, checked } = e.detail;
    if (checked) this.selected.add(id);
    else this.selected.delete(id);
    this.requestUpdate();
  }

  _toggleAll(e) {
    const checked = e.detail;
    const filtered = this._employees.filter((emp) =>
      Object.values(emp).join(' ').toLowerCase().includes(this.query.toLowerCase())
    );
    if (checked) filtered.forEach((emp) => this.selected.add(emp.id));
    else filtered.forEach((emp) => this.selected.delete(emp.id));
    this.requestUpdate();
  }

  _onEdit(id) {
    // Seçilen employee nesnesini bul
    const employee = this._employees.find(emp => emp._id === id || emp.id === id);
  
    // Global store’a ata
    employeeStore.selectedEmployee = employee;
    localStorage.setItem("editItem", JSON.stringify(employee));

  
    // Sayfayı yönlendir
    window.history.pushState({}, '', `/edit/${id}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
  

  _onDelete(id) {
    if (!confirm('Delete this record?')) return;
    employeeStore.remove(id);
    this.selected.delete(id);
  }

  _deleteSelected() {
    if (!confirm(`Delete ${this.selected.size} selected records?`)) return;
    [...this.selected].forEach((id) => employeeStore.remove(id));
    this.selected.clear();
  }
}

customElements.define('employee-list', EmployeeList);
