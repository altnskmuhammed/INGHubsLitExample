import { LitElement, html, css } from 'lit';
import { employeeStore } from '../store/employeeStore.js';

export class EmployeeGrid extends LitElement {
  static properties = {
    items: { type: Array },
    editingEmployee: { state: true },
  };

  static styles = css`
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      padding: 8px;
      width: 100vh;
      margin: 0 auto; /* grid container ortalansın */
    }

    .pair {
      display: flex;
      align-items: baseline;
      flex-direction: column;      
    }

    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 12px;
      background: #fff;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px;
      width: 50vh;
      height: 28vh;
    }

    .label { font-weight: bold; color: #555; }
    .value { text-align: right; color: #333; }
    .modal {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-content {
      background: white;
      padding: 20px;
      border-radius: 8px;
      width: 400px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .modal-content input {
      padding: 6px;
      font-size: 14px;
      width: 100%;
    }

    .modal-content label {
      font-weight: bold;
      color: #555;
    }

    .actions {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
    }

    button { border: none; background: transparent; cursor: pointer; font-size: 16px; }
  `;
 constructor() {
  super();
  this.items = [];
  this.editingEmployee = null;
}
  render() {
    return html`
      <div class="grid">
        ${this.items.map(e => html`
          <div class="card">
            <div class="pair">
              <div class="label">First Name:</div>
              <div class="value">${e.firstName}</div>
            </div>
            <div class="pair">
              <div class="label">Last Name:</div>
              <div class="value">${e.lastName}</div>
            </div>
            <div class="pair">
              <div class="label">Employment:</div>
              <div class="value">${e.dateOfEmployment}</div>
            </div>
            <div class="pair">
              <div class="label">Birth:</div>
              <div class="value">${e.dateOfBirth}</div>
            </div>
            <div class="pair">
              <div class="label">Phone:</div>
              <div class="value">${e.phoneNumber}</div>
            </div>
            <div class="pair">
              <div class="label">Email:</div>
              <div class="value">${e.emailAddress}</div>
            </div>
            <div class="pair">
              <div class="label">Department:</div>
              <div class="value">${e.department}</div>
            </div>
            <div class="pair">
              <div class="label">Position:</div>
              <div class="value">${e.position}</div>
            </div>

            <div class="actions">
              <icon-button
                icon="edit"
                title="Edit"
                text="Edit"
                style="background-color: #0000CD; color: white; border-radius:9px;"
                @icon-click=${() => this._startEdit(e)}
              ></icon-button>

              <icon-button
                icon="delete"
                title="Delete"
                text="Delete"
                style="background-color: #FF0000; color: white; border-radius:9px;"
                @icon-click=${() => this._delete(e.id)}
              ></icon-button>
            </div>
          </div>
        `)}
      </div>
    
    `;
  }




  _delete(id) {
    this.dispatchEvent(new CustomEvent('delete', { detail: id }));
  }
  _startEdit(employee) {
    if (!employee) return;
  
    // 1️⃣ Store’a ve localStorage’a kaydet
    employeeStore.selectedEmployee = employee;
    localStorage.setItem("editItem", JSON.stringify(employee));
  
    // 2️⃣ Sayfayı edit route’una yönlendir
    const id = employee.id || employee._id;
    if (id) {
      window.history.pushState({}, '', `/edit/${id}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else {
      console.warn("Employee ID bulunamadı!");
    }
  }
  




}


customElements.define('employee-grid', EmployeeGrid);
