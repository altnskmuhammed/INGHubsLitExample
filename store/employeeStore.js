export default class EmployeeStore {
    constructor() {
        this.key = 'employees_v1';
        this._listeners = new Set();
        this._data = [];
        this.selectedEmployee = null;
        this.lang = 'tr'; // default dil
        this._loadFromJSON();
      }
    
      // Dil değişikliği için
      setLang(newLang) {
        this.lang = newLang;
        this._emit(); // tüm bileşenler yeniden render olur
      }
    
      getLang() {
        return this.lang;
      }
    
      // Store subscriber
      subscribe(fn) {
        this._listeners.add(fn);
        fn(this._data, this.lang); // dil de iletilebilir
        return () => this._listeners.delete(fn);
      }
    
      _emit() {
        localStorage.setItem(this.key, JSON.stringify(this._data));
        this._listeners.forEach(f => f(this._data, this.lang));
      }
   

 
    getEmployeeById(id) {
        return this.employees.find(e => e.id === id);
      }
    list() { return [...this._data]; }
    find(id) { return this._data.find(e => e.id === id); }

    add(emp) {
        emp.id = crypto.randomUUID();
        this._data.push(emp);
        this._emit();
        return emp;
    }
    getEmployeeById(id) {
        return this._data.find(e => e.id === id);
      }
      
    update(id, patch) {
        const i = this._data.findIndex(e => e.id === id);
        if (i === -1) throw new Error('Not found');
        this._data[i] = { ...this._data[i], ...patch };
        this._emit();
        return this._data[i];
    }

    remove(id) {
        const exists = this._data.some(e => e.id === id);
        if (!exists) throw new Error('Employee not found');
        this._data = this._data.filter(e => e.id !== id);
        this._emit();
    }

    // --- JSON'dan veri yükleme ---
    async _loadFromJSON() {
        try {
            const res = await fetch('/employe.json');
            if (!res.ok) throw new Error('JSON yüklenemedi');
            const data = await res.json();

            // JSON’dan gelen verilerle localStorage güncelle
            this._data = data.map(emp => ({
                ...emp,
                id: emp.id || crypto.randomUUID()
              }));
              
            this._emit();
        } catch (err) {
            console.error("JSON'dan employee yüklenemedi:", err);
        }
    }
}

export const employeeStore = new EmployeeStore();
