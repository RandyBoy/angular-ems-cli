import {Injectable} from '@angular/core';
import rx = require('rxjs/rx');

@Injectable()
export class IndexedDBService2 {
    db: IDBOpenDBRequest;
    // private DEFAULTid = uuid();
    // get defaultId() { return this.DEFAULTid; };
    IDBTransactionModes = {
        'READ_ONLY': 'readonly',
        'READ_WRITE': 'readwrite',
        'VERSION_CHANGE': 'versionchange'
    };


    schema: Schema = {
        name: 'wxb',
        version: 1,
        db: null
    };

    // dbInfo = { name: 'mydb', Instance: null, version: 1 };
    // dbstore;
    /**
     *
     */
    constructor() {

    }

    openDBAsync(dbName: string, version: number): rx.Observable<string> {

        return rx.Observable.create((observer: rx.AsyncSubject<string>) => {
            // Opens the database.
            let request: IDBOpenDBRequest = indexedDB.open(dbName, version);

            // Success.
            request.onsuccess = (event: Event) => {
                // Instances the db object.
                this.db = (<IDBOpenDBRequest>event.target).result;
                observer.next((<IDBOpenDBRequest>event.target).readyState);
                observer.complete();
            };
            request.onerror = (event: Event) => {
                console.log('IndexedDB service: ' + (<IDBOpenDBRequest>event.target).error.name);
                observer.error((<IDBOpenDBRequest>event.target).error.name);
            };
            // The db doesn't exist, so cretes it.
            request.onupgradeneeded = (event: Event) => {
                // Instances the db object.
                this.db = (<IDBOpenDBRequest>event.target).result;
                // Instances the ObjectStores class and calls the createStores method.
                //    letobjectStores: ObjectStore = new ObjectStore();
                //   objectStores.createStores(this.db);
                console.log('IndexedDB service: creating ' + dbName + ' completed.');
            };
        });
    }
    // Ensure callback exists and is function, then do it...
    processCB(cb, out) {
        if (cb && typeof cb === 'function') {
            let err = (out === false) ? true : false;
            cb(err, out);
        } else {
            console.error('Improper callback');
        }
    };
    // Parse query to string for evaluation
    parseQuery(query) {
        let res = [];
        if (!Array.isArray(query)) {
            query = [query];
        }
        query.forEach((cond) => {
            // Set key
            let key: any = Object.keys(cond);
            key.forEach(element => {
                // Check for conditional
                if (typeof cond[element] === 'object') {
                    let condition: any = Object.keys(cond[element]);
                    condition.forEach(element2 => {
                        res.push({
                            field: element,
                            operand: element2,
                            value: cond[element][element2]
                        });
                    });
                } else {
                    // Direct (==) matching
                    res.push({
                        field: element,
                        operand: '$eq',
                        value: cond[element]
                    });
                }
            });
        });
        console.log(JSON.stringify(res));
        return res;
    };
    parseQuery2(query) {
        let res = [];
        if (!Array.isArray(query)) {
            query = [query];
        }
        query.forEach((cond) => {
            // Set key
            let key: any = Object.keys(cond);
            // Check for conditional
            if (typeof cond[key] === 'object') {
                let condition: any = Object.keys(cond[key]);

                res.push({
                    field: key[0],
                    operand: condition[0],
                    value: cond[key][condition]
                });

            } else {
                // Direct (==) matching
                res.push({
                    field: key[0],
                    operand: '$eq',
                    value: cond[key]
                });
            }
        });
        console.log(JSON.stringify(res));
        return res;
    };
    // Check data type
    checkType(obj) {
        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    };

    // Create indexedDB store
    create(cb) {
        let request = indexedDB.open('this.dbstore');

        // Handle onupgradeneeded
        request.onupgradeneeded = function (e) {
            let db: IDBDatabase = (<IDBOpenDBRequest>e.target).result;

            // Create store
            db.createObjectStore(this.dbstore, {
                keyPath: 'id',
                autoIncrement: false
            });
        };

        request.onsuccess = (e) => {
            (<IDBOpenDBRequest>e.target).result.close();
            this.processCB(cb, true);
        };

        request.onerror = function () {
            this.processCB(cb, false);
        };
    }

    // Add item to the store
    insert(tableName: string, data, cb) {
        //  let request = indexedDB.open(this.dbstore);
        // request.onsuccess = (e) => {
        // Setup trans and store
        //   let db: IDBDatabase = (<IDBOpenDBRequest>e.target).result;
        let trans = this.schema.db.transaction([tableName], this.IDBTransactionModes.READ_WRITE); //this.dbstore
        // console.log(trans);
        let store = trans.objectStore(tableName);
        // console.log(store);
        let i, returnQuery;

        let putNext = () => {
            if (i < data.length) {
                // Set id
                // data[i].id = new Date().getTime() + i;
                // Insert, call putNext recursively on success
                store.put(data[i]).onsuccess = putNext;
                //console.log('data', data[i]);
                i++;
            } else {
                // Complete
                this.find(tableName, returnQuery, cb);
            }
        };

        if (this.checkType(data) === 'array') {
            // Insert array of items
            i = 0;
            returnQuery = {
                'id': {
                    '$gte': '0' // new Date().getTime()
                }
            };

            putNext();

        } else {
            // Insert single item
            // data.id = new Date().getTime();
            let request = store.put(data);
            request.onsuccess = function (e) {
                // Run select to return new record
                this.find({
                    id: data.id
                }, cb);
                // db.close();
            };

            // Insert error
            request.onerror = (e) => {
                this.processCB(cb, false);
            };
        }
        //  };

        // General error
        // request.onerror = function () {
        //     this.processCB(cb, false);
        // };
    }

    traverse(tableName: string, query, data, cb) {
        // let request = indexedDB.open(this.dbstore);
        //   request.onsuccess = (e) => {
        // let db: IDBDatabase = (<IDBOpenDBRequest>e.target).result;
        let trans: IDBTransaction = this.schema.db.transaction([tableName], this.IDBTransactionModes.READ_WRITE);
        let store: IDBObjectStore = trans.objectStore(tableName);

        // Setup cursor request
        let keyRange: IDBKeyRange = IDBKeyRange.lowerBound(0);
        let cursorRequest: IDBRequest = store.openCursor(keyRange);
        let results: Array<any> = [];

        cursorRequest.onsuccess = (e) => {
            //jshint maxstatements: 24, maxcomplexity: 12
            let cursorValue: IDBCursorWithValue = (<IDBRequest>e.target).result;
            let prop;

            // Stop on no result
            if (!cursorValue) {
                return;
            }

            let evaluate = (val1, op, val2) => {
                switch (op) {
                    case '$gt':
                        return val1 > val2;
                    case '$lt':
                        return val1 < val2;
                    case '$gte':
                        return val1 >= val2;
                    case '$lte':
                        return val1 <= val2;
                    case '$ne':
                        return val1 !== val2;
                    case '$eq':
                        return val1 === val2;
                    case '$like':
                        return new RegExp(val2, 'i').test(val1);
                }
            }
            // Test query
            if (query) {
                let match = true;
                query.forEach((cond) => {
                    match = match && evaluate(cursorValue.value[cond.field], cond.operand, cond.value);
                });
                // Evaluate test condition
                if (match) {
                    // Check if update
                    if (this.checkType(data) === 'object') {
                        for (prop in data) {
                            cursorValue.value[prop] = data[prop];
                        }
                        cursorValue.update(cursorValue.value);
                    }
                    // Check if delete
                    if (data === 'delete') {
                        cursorValue.delete(); // (result.value.id);
                    }
                    // Push to array
                    results.push(cursorValue.value);
                }
            } else {
                // Check if update
                if (this.checkType(data) === 'object') {
                    for (prop in data) {
                        cursorValue.value[prop] = data[prop];
                    }
                    cursorValue.update(cursorValue.value);
                }
                // Check if delete
                if (data === 'delete') {
                    cursorValue.delete(); //result.value.id
                }
                // Push to array
                results.push(cursorValue.value);
            }
            // Move on
            cursorValue.continue();
        };
        console.log(results);
        // Entire transaction complete
        trans.oncomplete = (e) => {
            // Send results
            this.processCB(cb, results);
            // db.close();
        };

        // Cursor error
        cursorRequest.onerror = () => {
            this.processCB(cb, false);
        };
        // };

        // General error, cb false
        // request.onerror = () => {
        //     this.processCB(cb, false);
        // };

    }

    // Find record(s)
    find(tableName: string, filter?: any, callBack?: Function) {
        let query;
        let cb;
        // Check arguments to determine query
        // if (arguments.length === 1 && typeof arguments[0] === 'function') {
        //     // Find all
        //     cb = arguments[0];
        // } else {
        //     // Conditional find
        //     query = this.parseQuery(arguments[0]);
        //     cb = arguments[1];
        // }
        if (filter) {
            query = this.parseQuery(filter);
        }
        if (callBack) {
            cb = callBack;
        }
        this.traverse(tableName, query, false, cb);
    }


    // Update record(s)
    update(tableName: string, valueObject: any, filter?, callback?: Function) {
        let query;
        let data;
        let cb;
        // Check arguments to determine query
        if (callback) {
            cb = callback;
        }
        if (filter) {
            query = filter;
        }
        if (valueObject) {
            data = valueObject;
        }
        // if (arguments.length === 2 && typeof arguments[1] === 'function') {
        //     // Update all
        //     data = arguments[0];
        //     cb = arguments[1];
        // } else {
        //     // Update on match
        //     query = this.parseQuery(arguments[0]);
        //     data = arguments[1];
        //     cb = arguments[2];
        // }
        this.traverse(tableName, query, data, cb);
    }

    // Delete record(s)
    delete(tableName: string, filter: any, callBack: Function) {
        let query;
        let cb;
        if (filter) {
            query = this.parseQuery(filter);
        }
        if (callBack) {
            cb = callBack;
        }
        // Check arguments to determine query
        // if (arguments.length === 1 && typeof arguments[0] === 'function') {
        //     // Find all
        //     cb = arguments[0];
        // } else {
        //     // Conditional find
        //     query = this.parseQuery(arguments[0]);
        //     cb = arguments[1];
        // }
        this.traverse(tableName, query, 'delete', cb);
    }

    // Drop data store
    drop(cb: Function) {
        let deleteRequest = indexedDB.deleteDatabase(this.schema.name);
        // Golden
        deleteRequest.onsuccess = (e) => {
            this.processCB(cb, true);
            this.create(null);
        };
        // Blocked
        deleteRequest.onblocked = (e) => {
            this.processCB(cb, false);
        };
        // Something worse
        deleteRequest.onerror = () => {
            this.processCB(cb, false);
        };
    }



    initDB(schema: Schema) {
        schema.version = schema.version || 1;
        let usedatabase = (db) => {
            db.onversionchange = function (event) {
                schema.db.close();
                alert('A new version of this page is ready. Please reload!');
            };
        };

        let request: IDBOpenDBRequest = indexedDB.open(schema.name, schema.version);
        request.onerror = function (e) {
            // console.log(e.Target);
        };

        request.onsuccess = function (e) {
            schema.db = request.result;
            usedatabase(schema.db);
        };
        request.onblocked = (e) => {
            alert('Please close all other tabs with this site open!');
        };

        //usedatabase(db)
        // (dbObj.db as any).onversionchange


        request.onupgradeneeded = function (e) {
            let thisDB: IDBDatabase = (<IDBOpenDBRequest>e.target).result;
            if (!thisDB.objectStoreNames.contains('material')) {
                let objStore = thisDB.createObjectStore('material', { keyPath: 'id', autoIncrement: true });
                objStore.createIndex('wxid', 'wxid', { unique: true });
            }
            if (!thisDB.objectStoreNames.contains('account')) {
                let objStore = thisDB.createObjectStore('account', { keyPath: 'id', autoIncrement: true });
                objStore.createIndex('wxid', 'wxid', { unique: true });
                objStore.createIndex('nickName', 'nickName', { unique: false });
            }
            if (!thisDB.objectStoreNames.contains('employees')) {
                let employeeStore = thisDB.createObjectStore('employees', { keyPath: 'id' });
                employeeStore.createIndex('stateIndex', 'state', { unique: false });
                employeeStore.createIndex('emailIndex', 'email', { unique: true });
                employeeStore.createIndex('zipCodeIndex', 'zip_code', { unique: false });
            }
            usedatabase(thisDB);
        };
    }

    addData(schema: Schema, tableName: string, data: any, cb: Function) {
        try {
            let transaction = schema.db.transaction(tableName, 'readwrite');
            transaction.oncomplete = function () {
                console.log('transaction complete');
            };
            transaction.onerror = function (event) {
                console.dir(event);
            };

            let objectStore = transaction.objectStore(tableName);
            let request;
            if (data instanceof Array) {
                data.forEach(el => {
                    request = objectStore.add(el);
                    request.onsuccess = function (e) {
                        if (cb) {
                            cb({
                                error: 0,
                                data: data
                            });
                        }
                    };

                    request.onerror = function (e) {
                        if (cb) {
                            cb({ error: 1 });
                        }
                    };
                });

            } else {
                request = objectStore.add(data);
                request.onsuccess = function (e) {
                    if (cb) {
                        cb({
                            error: 0,
                            data: data
                        });
                    }
                };

                request.onerror = function (e) {
                    if (cb) {
                        cb({ error: 1 });
                    }
                };
            };

        } catch (e) {
            console.log(e);
        }
    }

    deleteData(schema: Schema, tableName: string, id: number, cb: Function) {
        let transaction = schema.db.transaction(tableName, 'readwrite');
        transaction.oncomplete = function () {
            console.log('transaction complete');
        };
        transaction.onerror = function (event) {
            console.dir(event);
        };
        var objectStore = transaction.objectStore(tableName);
        var request = objectStore.delete(id); //parseInt(id)
        request.onsuccess = function (e) {
            if (cb) {
                cb({
                    error: 0,
                    data: id
                });
            }
        };
        request.onerror = function (e) {
            if (cb) {
                cb({
                    error: 1
                });
            }
        };
    }

    getDataAll(schema: Schema, tableName: string, cb: Function) {
        let transaction = schema.db.transaction(tableName, 'readonly');
        transaction.oncomplete = function () {
            console.log('transaction complete');
        };
        transaction.onerror = function (event) {
            console.dir(event);
        };

        let objectStore = transaction.objectStore(tableName);
        let rowData = []; //IDBKeyRange.lowerBound(''E6'', true)
        objectStore.openCursor(IDBKeyRange.lowerBound('E6')).onsuccess = (e) => {
            let cursor: IDBCursorWithValue = (e.target as IDBRequest).result;
            if (!cursor && cb) {
                cb({
                    error: 0,
                    data: rowData
                });
                return;
            }
            if (cursor) {
                console.log(cursor);
                rowData.push(cursor.value);
                cursor.continue();
            }
        };
    }

    getDataById(schema: Schema, tableName, id, cb) {
        let transaction = schema.db.transaction(tableName, 'readwrite');
        transaction.oncomplete = function () {
            console.log('transaction complete');
        };
        transaction.onerror = function (event) {
            console.dir(event);
        };

        let objectStore = transaction.objectStore(tableName);
        let request = objectStore.get(id);

        request.onsuccess = function (e) {
            if (cb) {
                cb({ error: 0, data: (e.target as any).result });
            }
        };

        request.onerror = function (e) {
            if (cb) {
                cb({
                    error: 1
                });
            }
        };

    }

    getDataBySearch(schema: Schema, tableName: string, keywords, cb: Function) {
        var transaction = schema.db.transaction(tableName, 'readwrite');
        transaction.oncomplete = function () {
            console.log('transaction complete');
        };
        transaction.onerror = function (event) {
            console.dir(event);
        };

        var objectStore = transaction.objectStore(tableName);
        var boundKeyRange = IDBKeyRange.only(keywords);
        var rowData;
        objectStore.index('nickName').openCursor(boundKeyRange).onsuccess = function (event) {
            var cursor = (event.target as any).result;
            if (!cursor) {
                if (cb) {
                    cb({
                        error: 0,
                        data: rowData
                    });
                }
                return;
            }
            rowData = cursor.value;
            cursor.continue();
        };
    }

    getDataByPager(schema: Schema, tableName: string, start: number, end: number, cb: Function) {
        var transaction = schema.db.transaction(tableName, 'readwrite');
        transaction.oncomplete = function () {
            console.log('transaction complete');
        };
        transaction.onerror = function (event) {
            console.dir(event);
        };

        var objectStore = transaction.objectStore(tableName);
        var boundKeyRange = IDBKeyRange.bound(start, end, false, true);
        var rowData = [];
        objectStore.openCursor(boundKeyRange).onsuccess = function (event) {
            var cursor = (event.target as any).result;
            if (!cursor && cb) {
                cb({
                    error: 0,
                    data: rowData
                });
                return;
            }
            rowData.push(cursor.value);
            cursor.continue();
        };
    }

    updateData(schema: Schema, tableName: string, id: number, updateData: any, cb: Function) {
        let transaction = schema.db.transaction(tableName, 'readwrite');
        transaction.oncomplete = function () {
            console.log('transaction complete');
        };
        transaction.onerror = function (event) {
            console.dir(event);
        };

        let objectStore = transaction.objectStore(tableName);
        let request = objectStore.get(id);

        request.onsuccess = function (e) {
            let dr = (e.target as any).result;
            for (let key in updateData) {
                dr[key] = updateData[key];
            }
            objectStore.put(dr);
            if (cb) {
                cb({
                    error: 0,
                    data: dr
                });
            }
        };

        request.onerror = function (e) {
            if (cb) {
                cb({
                    error: 1
                });
            }
        };
    }

    closeDB(schema: Schema) {
        schema.db.close();
    }

    deleteDB(schema: Schema) {
        indexedDB.deleteDatabase(schema.name);
    }
}

interface Schema {
    name: string;
    version: number;
    db: IDBDatabase;
}