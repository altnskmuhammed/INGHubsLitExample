import { LitElement, html, css } from 'lit';
import '../components/nav-menu.js';
import '../components/EmployeeHeader.js';

import '../components/employee-list.js'

class EmployeesPage extends LitElement {
  static styles = css`
    .container {  margin:16px auto; display:grid; gap:12px; }
    .list { display:grid; gap:8px; }
    .employee { background:var(--card); padding:12px; border-radius:8px; display:flex; justify-content:space-between; align-items:center; }
    @media (min-width:720px){
      .list { grid-template-columns: 1fr 1fr; }
    }
  `;

  constructor(){
    super();
    this.employees = [];
   
  }

  connectedCallback(){
    super.connectedCallback();

  }
  disconnectedCallback(){
    if (this._unsub) this._unsub();
    super.disconnectedCallback();
  }

  _delete(id){
    store.deleteEmployee(id);
  }

  render(){
    return html`
    
      <div class="container">
  <employee-list></employee-list>
</div>



   
    `;
  }
}

customElements.define('employees-page', EmployeesPage);
