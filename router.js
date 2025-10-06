import { Router } from '@vaadin/router';

const outlet = document.getElementById('outlet');
const router = new Router(outlet);

// sayfaları dinamik import eden rota konfigürasyonu
router.setRoutes([
 
  { path: '/', component: 'employees-page' },
  { path: '/edit/:id', component: 'employee-form-page' },
  { path: '/add', component: 'employee-form-page' },
]);

// lazy-load page components (import side-effect defines customElements)
router.addRoutes = router.setRoutes; // no-op alias for clarity

// dynamic imports (could also import synchronously)
import('./pages/employees-page.js');
import('./pages/employee-detail-page.js');
