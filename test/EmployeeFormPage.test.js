// tests/EmployeeFormPage.test.js
import { fixture, html } from '@open-wc/testing';
import { vi, describe, it, beforeEach, afterEach, expect } from 'vitest';

// --- 1️⃣ Modülü mockla, top-level değişkene gerek yok ---
vi.mock('../store/employeeStore.js', () => {
  const storeMock = {
    selectedEmployee: null,
    getEmployeeById: vi.fn(),
    addEmployee: vi.fn(),
    updateEmployee: vi.fn(),
  };
  return {
    default: storeMock, // Eğer component 'import store from ...' kullanıyorsa
    store: storeMock,   // Eğer component 'export const store' kullanıyorsa
  };
});

// --- 2️⃣ Mock’tan sonra component’i import et ---
import '../components/employee-form.js';

describe('EmployeeFormPage', () => {
  let store; // testlerde erişmek için

  beforeEach(async () => {
    // mock store'u test içinde import et
    ({ store } = await vi.importMock('../store/employeeStore.js'));

    store.selectedEmployee = null;
    store.getEmployeeById.mockReset();
    store.addEmployee.mockReset();
    store.updateEmployee.mockReset();

    localStorage.clear();
    history.pushState({}, '', '/');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders form inputs with default values (add mode)', async () => {
    const el = await fixture(html`<employee-form-page></employee-form-page>`);
    await el.updateComplete;

    const firstName = el.shadowRoot.querySelector('.firstName input');
    const lastName = el.shadowRoot.querySelector('.lastName input');
    const email = el.shadowRoot.querySelector('.email input');

    expect(firstName).toBeTruthy();
    expect(firstName.value).toBe('');
    expect(lastName.value).toBe('');
    expect(email.value).toBe('');
  });

  it('populates fields from store.selectedEmployee when editing', async () => {
    const emp = {
      id: 'abc123',
      firstName: 'John',
      lastName: 'Doe',
      emailAddress: 'john@example.com',
      phoneNumber: '555-42',
      department: 'IT',
      position: 'Junior',
      dateOfEmployment: '2020-01-01',
      dateOfBirth: '1990-02-02',
    };
    store.selectedEmployee = emp;
    history.pushState({}, '', '/edit/abc123');

    const el = await fixture(html`<employee-form-page></employee-form-page>`);
    await el.updateComplete;

    const firstName = el.shadowRoot.querySelector('.firstName input');
    const email = el.shadowRoot.querySelector('.email input');

    expect(firstName.value).toBe('John');
    expect(email.value).toBe('john@example.com');
  });

  it('falls back to localStorage.editItem when store has no selectedEmployee', async () => {
    const emp = {
      id: 'ls-1',
      firstName: 'LS',
      lastName: 'User',
      emailAddress: 'ls@example.com',
      phoneNumber: '000',
      department: 'HR',
      position: 'Senior',
      dateOfEmployment: '2019-05-05',
      dateOfBirth: '1985-05-05',
    };
    store.selectedEmployee = null;
    store.getEmployeeById.mockReturnValue(undefined);
    localStorage.setItem('editItem', JSON.stringify(emp));

    history.pushState({}, '', '/edit/ls-1');

    const el = await fixture(html`<employee-form-page></employee-form-page>`);
    await el.updateComplete;

    const firstName = el.shadowRoot.querySelector('.firstName input');
    expect(firstName.value).toBe('LS');
  });

  it('updates this.employee when input changes', async () => {
    const el = await fixture(html`<employee-form-page></employee-form-page>`);
    await el.updateComplete;

    const firstNameInput = el.shadowRoot.querySelector('.firstName input');
    firstNameInput.value = 'Alice';
    firstNameInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(el.employee.firstName).toBe('Alice');
  });

  it('calls store.addEmployee on Save in add mode', async () => {
    const el = await fixture(html`<employee-form-page></employee-form-page>`);
    await el.updateComplete;

    const saveBtn = el.shadowRoot.querySelector('.btn-save');
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    saveBtn.click();
    await el.updateComplete;

    expect(store.addEmployee).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'location-changed' }));
  });

  it('calls store.updateEmployee on Save in edit mode', async () => {
    const emp = { id: 'u1', firstName: 'U', lastName: 'One', emailAddress: '' };
    store.selectedEmployee = emp;
    history.pushState({}, '', '/edit/u1');

    const el = await fixture(html`<employee-form-page></employee-form-page>`);
    await el.updateComplete;

    const saveBtn = el.shadowRoot.querySelector('.btn-save');
    saveBtn.click();
    await el.updateComplete;

    expect(store.updateEmployee).toHaveBeenCalledWith(expect.objectContaining({ id: 'u1' }));
  });

  it('Cancel navigates back and fires location-changed', async () => {
    const el = await fixture(html`<employee-form-page></employee-form-page>`);
    await el.updateComplete;

    const cancelSpy = vi.spyOn(window, 'dispatchEvent');
    const cancelBtn = el.shadowRoot.querySelector('.btn-cancel');
    cancelBtn.click();
    await el.updateComplete;

    expect(cancelSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'location-changed' }));
  });
});
