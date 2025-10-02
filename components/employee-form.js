import { LitElement, html, css } from 'lit';
import { employeeStore } from '../store/employeeStore.js';

export class EmployeeForm extends LitElement {
  static properties = {
    employeeId: { type: String, reflect: true }, // attribute reflection önemli
    _employee: { state: true }
  };

  static styles = css`
    form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 400px;
    }
    label {
      display: flex;
      flex-direction: column;
      font-weight: 500;
    }
    input, select {
      padding: 6px;
      font-size: 14px;
    }
    button {
      padding: 8px 12px;
      cursor: pointer;
    }
  `;

  constructor() {
    super();
    this.employeeId = null;
    this._employee = {};
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadEmployee();
  }

  updated(changedProps) {
    if (changedProps.has('employeeId')) {
      this._loadEmployee();
    }
  }

  _loadEmployee() {
    if (this.employeeId) {
      this._employee = employeeStore.find(this.employeeId) || {};
    } else {
      this._employee = {};
    }
  }

  render() {
    const e = this._employee || {};
    return html`
      <h2>${this.employeeId ? 'Edit' : 'Add'} Employee</h2>
      <form @submit=${this._onSubmit}>
        <label>
          First Name
          <input name="firstName" .value=${e.firstName || ''} required minlength="2" />
        </label>
        <label>
          Last Name
          <input name="lastName" .value=${e.lastName || ''} required minlength="2" />
        </label>
        <label>
          Date of Birth
          <input name="dob" type="date" .value=${e.dob || ''} required />
        </label>
        <label>
          Date of Employment
          <input name="employmentDate" type="date" .value=${e.employmentDate || ''} required />
        </label>
        <label>
          Phone
          <input name="phone" .value=${e.phone || ''} required />
        </label>
        <label>
          Email
          <input name="email" type="email" .value=${e.email || ''} required />
        </label>
        <label>
          Department
          <select name="department" .value=${e.department || 'Analytics'}>
            <option>Analytics</option>
            <option>Tech</option>
          </select>
        </label>
        <label>
          Position
          <select name="position" .value=${e.position || 'Junior'}>
            <option>Junior</option>
            <option>Medior</option>
            <option>Senior</option>
          </select>
        </label>
        <div style="display:flex; gap:8px">
          <button type="submit">${this.employeeId ? 'Update' : 'Create'}</button>
          <button type="button" @click=${()=>location.href='/'}>Cancel</button>
        </div>
      </form>
    `;
  }

  _validate(data) {
    const errors = [];
    if (new Date(data.dob) > new Date()) errors.push('DOB cannot be in the future');
    if (new Date(data.employmentDate) > new Date()) errors.push('Employment date cannot be in the future');
    if (new Date(data.employmentDate) < new Date(data.dob)) errors.push('Employment date must be after DOB');

    const existing = employeeStore.list().find(
      (e) => e.email.toLowerCase() === data.email.toLowerCase() && e.id !== this.employeeId
    );
    if (existing) errors.push('Email already used');

    return errors;
  }

  _onSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      dob: form.dob.value,
      employmentDate: form.employmentDate.value,
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      department: form.department.value,
      position: form.position.value
    };

    const errs = this._validate(data);
    if (errs.length) {
      alert('Validation errors:\n' + errs.join('\n'));
      return;
    }

    const confirmed = confirm(this.employeeId ? 'Update employee?' : 'Create employee?');
    if (!confirmed) return;

    if (this.employeeId) {
      employeeStore.update(this.employeeId, data);
    } else {
      employeeStore.add(data);
    }

    location.href = '/';
  }
}

customElements.define('employee-form', EmployeeForm);
