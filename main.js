import { Router } from '@vaadin/router';
import './components/nav-menu.js';
import './components/employee-list.js';
import './components/employee-form.js';


window.addEventListener('DOMContentLoaded', () => {
  const outlet = document.getElementById('outlet');
  if (!outlet) {
    console.error('Outlet (#outlet) bulunamadı!');
    return;
  }

  // Nav bar mount
  const topNav = document.getElementById('nav-menu');
  if (topNav && !topNav.querySelector('nav-menu')) {
    const nav = document.createElement('nav-menu');
    topNav.appendChild(nav);
  }

  // Vaadin Router setup
  const router = new Router(outlet);
  router.setRoutes([
    {
      path: '/',
      component: 'employee-list', // employee-list burada render olacak
    },
    {
      path: '/add',
      component: 'employee-form',
    },
    {
      path: '/edit/:id',
      component: 'employee-form',
      action: (context, commands) => {
        return commands.component('employee-form', { employeeId: context.params.id });
      }
    }
  ]);
});
