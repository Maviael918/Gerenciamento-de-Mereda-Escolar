// static/js/idb.js
class MerendaDB {
    constructor() {
      this.db = null;
      this.initDB();
    }
  
    initDB() {
      const request = indexedDB.open('MerendaEscolarDB', 1);
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('escolas')) {
          db.createObjectStore('escolas', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('produtos')) {
          const store = db.createObjectStore('produtos', { keyPath: 'id' });
          store.createIndex('frise', 'frise', { unique: false });
        }
      };
  
      request.onsuccess = (event) => {
        this.db = event.target.result;
      };
    }
  
    // Métodos CRUD para escolas e produtos...
  }