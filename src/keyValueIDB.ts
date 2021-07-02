var keyValueIDB = {
	async init(): Promise<void> {
		return new Promise((resolve, reject) => {
			let idbCmp = window.indexedDB;
			let dbPromise = idbCmp.open("db");
			dbPromise.onerror = (err: any) => {
				console.error(err);
				reject();
			}	
			dbPromise.onupgradeneeded = (event: any) => {
				let db = event.target.result;
				db.createObjectStore("keyValue");
				resolve();
			}
			dbPromise.onsuccess = () => {
				resolve();
			}
		});
	},

	async getValue(key: string): Promise<any> {
		return new Promise((resolve, reject) => {
			let oRequest = indexedDB.open('db');
			oRequest.onsuccess = function() {
				let db = oRequest.result;
				let tx = db.transaction('keyValue', 'readonly');
				let st = tx.objectStore('keyValue');
				let gRequest = st.get(key);
				gRequest.onsuccess = function() {
					resolve(gRequest.result);
				}
				gRequest.onerror = function() {
					reject(gRequest.error);
				}
			}
			oRequest.onerror = function() {
				reject(oRequest.error);
			}
		})
	},

	async setValue(key: string, value: any): Promise<void>  {
		return new Promise((resolve, reject) => {
			let oRequest = indexedDB.open('db');
			oRequest.onsuccess = function() {
				let db = oRequest.result;
				let tx = db.transaction('keyValue', 'readwrite');
				let st = tx.objectStore('keyValue');
				let sRequest = st.put(value, key);
				sRequest.onsuccess = function() {
					resolve();
				}
				sRequest.onerror = function() {
					reject(sRequest.error);
				}
			}
			oRequest.onerror = function() {
				reject(oRequest.error);
			}
		})
	}
}

export default keyValueIDB