import { LitElement, html, css } from 'lit';
import '../components/employee-form.js'; // Form component

export class EmployeeDetailPage extends LitElement {
  static properties = {
    employeeId: { type: String },
  };

  constructor() {
    super();
    this.employeeId = null;
  }

  connectedCallback() {
    super.connectedCallback();
    const match = window.location.pathname.match(/\/detail\/(.+)/);
    if(match) this.employeeId = match[1];
  }

  render() {
    return html`
      <h2>Employee Detail</h2>
      <!-- EmployeeFormPage'i burada kullanıyoruz -->
      <employee-form .employeeId=${this.employeeId}></employee-form>
    `;
  }
}

customElements.define('employee-detail-page', EmployeeDetailPage);
