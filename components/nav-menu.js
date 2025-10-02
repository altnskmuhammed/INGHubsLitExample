import { LitElement, html, css } from 'lit';

class NavMenu extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 12px;
      background: #ffffff;
    }
    nav {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    a {
      color: orange;
      text-decoration: none;
    }
  `;

  render() {
    return html`
      <nav>
        <a href="/">Employees</a>
        <a href="/add">Add New</a>
      </nav>
    `;
  }
}

customElements.define('nav-menu', NavMenu);
