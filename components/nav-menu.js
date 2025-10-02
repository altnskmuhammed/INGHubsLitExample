import { LitElement, html, css } from 'lit';

class NavMenu extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 12px;
      background: #ffffff;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    nav {
      display: flex;
      gap: 16px;
      align-items: center;
      justify-content:space-between;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: bold;
      font-size: 18px;
      color: #ff6600;
    }
    .logo svg {
      width: 24px;
      height: 24px;
      fill: #ff6600;
    }
    .header-buttons a {
      color:orange
    }
    a {
      color: #444;
      text-decoration: none;
      font-weight: 500;
    }
    a:hover {
      color: #ff6600;
    }
  `;

  render() {
    return html`
      <nav>
        <div class="logo">
          <!-- Basit bir kullanıcı ikon SVG’si -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
          ING
        </div>
      <div class="header-buttons">
      <a href="/">Employees</a>
      <a href="/add">Add New</a>
      </div>
      </nav>
    `;
  }
}

customElements.define('nav-menu', NavMenu);
