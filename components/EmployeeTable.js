import { LitElement, html, css } from 'lit';

export class EmployeeTable extends LitElement {
  static properties = {
    items: { type: Array },
    selected: { type: Object },
  };

  static styles = css`
    table {
      width: 100%;
      border-collapse: collapse;
      background: #fff;
    }
    tbody{
      height: 53vh;
    }
    thead {
      background-color: #f8f8f8;
      position: sticky;
      top: 0;
      z-index: 1;
    }

    th, td {
      text-align: center;
      padding: 10px;
      font-size: 14px;
    }

    th {
      color: orange;
      border-bottom: 1px solid #ccc;
      background-color: #fff;
    }

    td {
      border-bottom: 1px solid #eee;
      color: #333;
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
      padding: 0.3em 0.6em;
      border-radius: 0.5em;
      border: 1px solid #ddd;
      cursor: pointer;
      background: white;
    }

    /* Responsive */
    @media (max-width: 768px) {
      table, thead, tbody, th, td, tr {
        display: block;
        width: 100%;
      }
      thead {
        display: none;
      }
      tr {
        margin-bottom: 12px;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 8px;
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
    }
  `;

  render() {
    const allSelected =
      this.items.length > 0 && this.items.every((e) => this.selected.has(e.id));

    return html`
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                .checked=${allSelected}
                @change=${(e) => this._toggleAll(e)}
              />
            </th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date of Employment</th>
            <th>Date of Birth</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Department</th>
            <th>Position</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${this.items.map(
            (e) => html`
              <tr>
                <td data-label="Select">
                  <input
                    type="checkbox"
                    .checked=${this.selected.has(e.id)}
                    @change=${(ev) => this._toggleOne(ev, e.id)}
                  />
                </td>
                <td data-label="First Name">${e.firstName}</td>
                <td data-label="Last Name">${e.lastName}</td>
                <td data-label="Employment">${e.dateOfEmployment}</td>
                <td data-label="Birth">${e.dateOfBirth}</td>
                <td data-label="Phone">${e.phoneNumber}</td>
                <td data-label="Email">${e.emailAddress}</td>
                <td data-label="Department">${e.department}</td>
                <td data-label="Position">${e.position}</td>
                <td class="actions" data-label="Actions">
                      <icon-button
            icon="edit"
            title="Edit"
          color=${this.view =  '#fa8c16'}
            @icon-click=${() => this._edit(e.id)}
          ></icon-button>
                 
                             <icon-button
            icon="delete"
            title="Delete"
          color=${this.view =  '#FF0000'}
            @icon-click=${() => this._delete(e.id)}
          ></icon-button>
                </td>
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }

  _toggleOne(e, id) {
    this.dispatchEvent(
      new CustomEvent('toggle-one', { detail: { id, checked: e.target.checked } })
    );
  }

  _toggleAll(e) {
    this.dispatchEvent(
      new CustomEvent('toggle-all', { detail: e.target.checked })
    );
  }

  _edit(id) {
    this.dispatchEvent(new CustomEvent('edit', { detail: id }));
  }

  _delete(id) {
    this.dispatchEvent(new CustomEvent('delete', { detail: id }));
  }
}

customElements.define('employee-table', EmployeeTable);
