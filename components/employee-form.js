import { LitElement, html, css } from 'lit';
import store from '../store/employeeStore.js';


export class EmployeeFormPage extends LitElement {
  static properties = {
    employeeId: { type: String },
    employee: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      background: #f7f8fa;
    
      padding: 32px;
      font-family: 'Inter', sans-serif;
    }

    .container {
      background: white;
      border-radius: 12px;
      max-width: 5000px;
      margin: 0 auto;
      padding: 28px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }

    h2 {
      color: #f97316;
      font-weight: 700;
      font-size: 20px;
      margin-bottom: 16px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-areas:
        "firstName lastName dateEmployment"
        "birth phone email"
        "department position position"
        "actions actions actions";
      gap: 80px;
    }

    .field {
      display: flex;
      flex-direction: column;
    }

    label {
      font-size: 13px;
      font-weight: 600;
      color: #555;
      margin-bottom: 6px;
    }

    input, select {
      padding: 10px 12px;
      border: none;
      border-radius: 8px;
      background: #fff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.08);
      font-size: 14px;
      transition: all 0.15s ease;
    }

    input:focus, select:focus {
      outline: none;
      box-shadow: 0 0 0 2px #f97316, 0 4px 10px rgba(0,0,0,0.08);
    }

    /* Grid Areas */
    .firstName { grid-area: firstName; }
    .lastName { grid-area: lastName; }
    .dateEmployment { grid-area: dateEmployment; }
    .birth { grid-area: birth; }
    .phone { grid-area: phone; }
    .email { grid-area: email; }
    .department { grid-area: department; }
    .position {         }
    .actions { grid-area: actions; text-align: center; margin-top: 10px; }

    .btn {
      padding: 10px 30px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
    }

    .btn-save {
      background: #ff6600;
      color: white;
      margin-right: 12px;
    }

    .btn-cancel {
      background: white;
      color: #4f46e5;
      border: 1px solid #d1d5db;
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
        grid-template-areas:
          "firstName"
          "lastName"
          "dateEmployment"
          "birth"
          "phone"
          "email"
          "department"
          "position"
          "actions";
      }
    }
  `;

  constructor() {
    super();
    this.employeeId = null;
    this.employee = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phoneNumber: '',
      emailAddress: '',
      department: '',
      position: '',
    };
  }

  connectedCallback() {
    super.connectedCallback();
  
    const match = window.location.pathname.match(/\/edit\/(.+)/);
    if (match) {
      this.employeeId = match[1];
      console.log("🆔 Edit sayfasındaki ID:", this.employeeId);
  
     
      let emp = store.selectedEmployee || store.getEmployeeById?.(this.employeeId);
  
      
      if (!emp) {
        const saved = localStorage.getItem("editItem");
        if (saved) {
          try {
            emp = JSON.parse(saved);
            console.log("💾 LocalStorage’dan yüklendi:", emp);
          } catch (e) {
            console.warn("LocalStorage parse hatası:", e);
          }
        }
      }
  
      
      if (emp) {
        this.employee = { ...emp };
        console.log("✅ Formda gösterilecek employee:", this.employee);
      } else {
        console.warn("⚠️ Employee store veya localStorage’ta bulunamadı.");
      }
    } else {
      console.log("ℹ️ Yeni kayıt (add mode).");
    }
  }
  
  

  render() {
    return html`
     <h2>${this.employee ? 'Edit Employee' : 'Add Employee'}</h2>
      <div class="container">
       

        <div class="form-grid">
          <div class="field firstName">
            <label>First Name</label>
            <input type="text" .value=${this.employee.firstName} @input=${e => this._updateField('firstName', e.target.value)}>
          </div>

          <div class="field lastName">
            <label>Last Name</label>
            <input type="text" .value=${this.employee.lastName} @input=${e => this._updateField('lastName', e.target.value)}>
          </div>

          <div class="field dateEmployment">
            <label>Date of Employment</label>
            <input type="date" .value=${this.employee.dateOfEmployment} @input=${e => this._updateField('dateOfEmployment', e.target.value)}>
          </div>

          <div class="field birth">
            <label>Date of Birth</label>
            <input type="date" .value=${this.employee.dateOfBirth} @input=${e => this._updateField('dateOfBirth', e.target.value)}>
          </div>

          <div class="field phone">
            <label>Phone</label>
            <input type="text" .value=${this.employee.phoneNumber} @input=${e => this._updateField('phoneNumber', e.target.value)}>
          </div>

          <div class="field email">
            <label>Email</label>
            <input type="email" .value=${this.employee.emailAddress} @input=${e => this._updateField('emailAddress', e.target.value)}>
          </div>

          <div class="field department">
            <label>Department</label>
            <input type="text" .value=${this.employee.department} @input=${e => this._updateField('department', e.target.value)}>
          </div>

          <div class="field position">
            <label>Position</label>
            <select @change=${e => this._updateField('position', e.target.value)}>
              <option>Please Select</option>
              <option ?selected=${this.employee.position === 'Junior'}>Junior</option>
              <option ?selected=${this.employee.position === 'Senior'}>Senior</option>
              <option ?selected=${this.employee.position === 'Midior'}>Midior</option>
              
            </select>
          </div>

          <div class="actions">
            <button class="btn btn-save" @click=${this._save}>Save</button>
            <button class="btn btn-cancel" @click=${this._cancel}>Cancel</button>
          </div>
        </div>
      </div>
    `;
  }

  _updateField(key, value) {
    this.employee = { ...this.employee, [key]: value };
  }

  _save() {
    if (this.employeeId) store.updateEmployee?.(this.employee);
    else store.addEmployee?.(this.employee);
    history.pushState({}, '', '/');
    window.dispatchEvent(new Event('location-changed'));
  }

  _cancel() {
    history.pushState({}, '', '/');
    window.dispatchEvent(new Event('location-changed'));
  }
}

customElements.define('employee-form-page', EmployeeFormPage);
