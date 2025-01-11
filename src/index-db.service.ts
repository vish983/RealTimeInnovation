import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IndexDBService {
  private db: IDBDatabase | null = null; // This will hold the database reference
  private dbName = 'myDatabase'; // The name of our IndexedDB
  private storeName = 'realTimeStore'; // The name of the object store (like a table in a DB)

  constructor() {
    this.openDb(); // Open the database when the service is created
  }

  private openDb(): void {
    const request = indexedDB.open(this.dbName, 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db: IDBDatabase = (event.target as IDBRequest).result;
      if (!db.objectStoreNames.contains(this.storeName)) {
        const objectStore = db.createObjectStore(this.storeName, {
          keyPath: 'id',
          autoIncrement: true,
        });
        objectStore.createIndex('id', 'id', { unique: true }); // Create an index for 'name'
        // objectStore.createIndex('designation', 'designation', { unique: false });
        // objectStore.createIndex('startDate', 'startDate', { unique: false });
        // objectStore.createIndex('endDate', 'endDate', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      this.db = (event.target as IDBRequest).result;
      console.log('Database opened successfully');
    };

    request.onerror = (event) => {
      console.error('Error opening IndexedDB database:', event);
    };
  }

  // Save or update data (PUT)
  public saveData(data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const objectStore = transaction.objectStore(this.storeName);
        const request = objectStore.put(data); // `put` is used for both add and update

        request.onsuccess = () => {
          console.log('Data saved successfully');
          resolve(); // Resolve the promise when saving is successful
        };

        request.onerror = (event) => {
          console.error('Error saving data:', event);
          reject('Error saving data'); // Reject if there's an error
        };
      } else {
        reject('Database is not open yet'); // Reject if the database is not open
      }
    });
  }

  // Get a record by id (GET)
  public getData(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        const transaction = this.db.transaction([this.storeName]);
        const objectStore = transaction.objectStore(this.storeName);
        const request = objectStore.get(parseInt(id)); // Get data by id
        request.onsuccess = (e) => {
          if (request.result) {
            resolve(request.result); // Resolve with the result if found
          } else {
            resolve(null); // Resolve null if no result found
          }
        };

        request.onerror = (event) => {
          console.error('Error fetching data by ID:', event);
          reject('Error fetching data by ID'); // Reject if there's an error
        };
      } else {
        reject('Database is not open yet'); // Reject if the database is not open
      }
    });
  }

  // Get all data (GET)
  public getAllData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        const transaction = this.db.transaction([this.storeName], 'readonly');
        const objectStore = transaction.objectStore(this.storeName);
        const dataWithIds: any[] = [];
        // Use a cursor to iterate through all records
        const request = objectStore.openCursor();
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            const record = cursor.value;
            record.id = cursor.key; // Attach the ID (primary key) to the record
            dataWithIds.push(record); // Add the record to the array
            cursor.continue(); // Continue to the next record
          } else {
            // Resolve the promise with the collected data once all records are processed
            resolve(dataWithIds);
          }
        };
      }
    });
  }

  // Delete a record by id (DELETE)
  public deleteData(id: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const objectStore = transaction.objectStore(this.storeName);
        const request = objectStore.delete(parseInt(id)); // Delete data by id

        request.onsuccess = () => {
          console.log('Data deleted successfully');
          resolve(); // Resolve when the delete is successful
        };

        request.onerror = (event) => {
          console.error('Error deleting data:', event);
          reject('Error deleting data'); // Reject if there's an error
        };
      } else {
        reject('Database is not open yet'); // Reject if the database is not open
      }
    });
  }
}
