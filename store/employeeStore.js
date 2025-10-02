export class EmployeeStore {
    constructor() {
        this.key = 'employees_v1';
        this._listeners = new Set();
        try {
            this._data = JSON.parse(localStorage.getItem(this.key) || '[]');
        } catch(e) {
            this._data = [];
        }
    }
    subscribe(fn) {
        this._listeners.add(fn);
        fn(this._data);
        return () => this._listeners.delete(fn);
    }
    _emit() {
        localStorage.setItem(this.key, JSON.stringify(this._data));
        this._listeners.forEach(f => f(this._data));
    }
    list() { return [...this._data]; }
    find(id) { return this._data.find(e => e.id === id); }
    add(emp) {
        emp.id = crypto.randomUUID();
        this._data.push(emp);
        this._emit();
        return emp;
    }
    update(id, patch) {
        const i = this._data.findIndex(e => e.id === id);
        if(i === -1) throw new Error('Not found');
        this._data[i] = {...this._data[i], ...patch};
        this._emit();
        return this._data[i];
    }
    remove(id) {
        const exists = this._data.some(e => e.id === id);
        if (!exists) throw new Error('Employee not found');
        this._data = this._data.filter(e => e.id !== id);
        this._emit();
    }
}

export const employeeStore = new EmployeeStore();

// --- Örnek veriler ekleme ---
if (employeeStore.list().length === 0) {
    employeeStore.add({
        firstName: 'John',
        lastName: 'Doe',
        dob: '1990-05-15',
        employmentDate: '2020-01-10',
        phone: '555-1234',
        email: 'john.doe@example.com',
        department: 'Tech',
        position: 'Senior'
    });

    employeeStore.add({
        firstName: 'Jane',
        lastName: 'Smith',
        dob: '1988-09-20',
        employmentDate: '2019-03-05',
        phone: '555-5678',
        email: 'jane.smith@example.com',
        department: 'Analytics',
        position: 'Medior'
    });

    employeeStore.add({
        firstName: 'Alice',
        lastName: 'Johnson',
        dob: '1995-11-12',
        employmentDate: '2021-06-15',
        phone: '555-9012',
        email: 'alice.johnson@example.com',
        department: 'Tech',
        position: 'Junior'
    });
}
