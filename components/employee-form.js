import { LitElement, html, css } from 'lit';
import store from '../store/employeeStore.js';

export class EmployeeFormPage extends LitElement {
  static properties = {
    employeeId: { type: String },
    employee: { state: true },
  };

  static styles = css`
    .form-container { max-width:500px; margin:20px auto; display:flex; flex-direction:column; gap:12px; padding:20px; border:1px solid #ddd; border-radius:8px; background:#fff; }
    label { font-weight:bold; }
    input { padding:6px; font-size:14px; width:100%; }
    button { padding:8px 16px; font-size:14px; border-radius:4px; border:none; cursor:pointer; }
    .save-btn { background-color:#1890ff; color:white; }
    .cancel-btn { background-color:#ff4d4f; color:white; }
  `;

  constructor() {
    super();
    this.employeeId = null;
    this.employee = { firstName:'', lastName:'', dateOfEmployment:'', dateOfBirth:'', phoneNumber:'', emailAddress:'', department:'', position:'' };
  }

  connectedCallback() {
    super.connectedCallback();
    const match = window.location.pathname.match(/\/edit\/(.+)/);
    if(match) this.employeeId = match[1];

    if(this.employeeId) {
      const emp = store.getEmployeeById(this.employeeId);
      if(emp) this.employee = {...emp};
    }
  }

  render() {
    return html`
      <div class="form-container">
        <h3>${this.employeeId ? 'Edit Employee' : 'Add Employee'}</h3>
        ${Object.keys(this.employee).map(key => html`
          <label>${this._formatLabel(key)}</label>
          <input type="text" .value=${this.employee[key]} @input=${e => this._updateField(key, e.target.value)}>
        `)}
        <div style="display:flex; justify-content:space-between;">
          <button class="save-btn" @click=${this._save}>Save</button>
          <button class="cancel-btn" @click=${this._cancel}>Cancel</button>
        </div>
      </div>
    `;
  }

  _formatLabel(key) {
    return key.replace(/([A-Z])/g,' $1').replace(/^./, str => str.toUpperCase());
  }

  _updateField(key, value) {
    this.employee = { ...this.employee, [key]: value };
  }

  _save() {
    if(this.employeeId) store.updateEmployee(this.employee);
    else store.addEmployee(this.employee);
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new Event('location-changed'));
  }

  _cancel() {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new Event('location-changed'));
  }
}

customElements.define('employee-form-page', EmployeeFormPage);
