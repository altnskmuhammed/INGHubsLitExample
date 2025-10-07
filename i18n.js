import store from './store/employeeStore.js';

const messages = {
  en: {
    title: 'Employee List',
    home: 'Home',
    employees: 'Employees',
    listView: 'List View',
    gridView: 'Grid View',
    addEmployee: 'Add Employee',
    addNew: 'Add New',

    firstName: 'First Name',
    lastName: 'Last Name',
    dateOfEmployment: 'Date of Employment',
    dateOfBirth: 'Date of Birth',
    phone: 'Phone',
    email: 'Email',
    department: 'Department',
    position: 'Position',
    actions: 'Actions',
  },

  tr: {
    title: 'Çalışan Listesi',
    home: 'Ana Sayfa',
    employees: 'Çalışanlar',
    listView: 'Liste Görünümü',
    gridView: 'Grid Görünümü',
    addEmployee: 'Çalışan Ekle',
    addNew: 'Yeni Ekle',

    
    firstName: 'Ad',
    lastName: 'Soyad',
    dateOfEmployment: 'İşe Başlama Tarihi',
    dateOfBirth: 'Doğum Tarihi',
    phone: 'Telefon',
    email: 'E-posta',
    department: 'Departman',
    position: 'Pozisyon',
    actions: 'İşlemler',
  }
};


export function getLang() {
  return document.documentElement.lang || store.getState().ui.lang || 'en';
}
export function changeLang(lang) {
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
    window.dispatchEvent(new CustomEvent('lang-changed', { detail: lang }));
  }
  

export function t(key) {
  const lang = getLang();
  return (messages[lang] && messages[lang][key]) || messages['en'][key] || key;
}