import { Component, OnDestroy } from '@angular/core';
import { RoutedemoComponent } from './+routedemo';
import { Routes, ROUTER_DIRECTIVES, Router} from '@angular/router';
import { RoutetestComponent } from './+routetest';
//import {AlertComponent} from 'ng2-bootstrap';
import {MdCheckbox} from '@angular2-material/checkbox/checkbox';
import {MD_CARD_DIRECTIVES } from '@angular2-material/card/card';
import {MdButton } from '@angular2-material/button';
//import { MdIcon } from '@angular2-material/icon';
import * as moment from 'moment';
import {LoadingComponent } from './loading/loading.component';
import {PageLoadingComponent } from './loading/pageloading.component';
import { OnActivate, CanDeactivate } from '@angular/router';
import * as Rx from 'rxjs/Rx';
import {Base} from './base';
import { HttpDemo } from './+http';
import {LoadingContainer} from './loading/loadingcontainer';
import {IndexedDBService} from './indexedDBService';

@Component({
  moduleId: module.id,
  selector: 'ems-app',
  templateUrl: 'ems.component.html',
  styleUrls: ['ems.component.css'],
  directives: [ROUTER_DIRECTIVES, MdCheckbox, MD_CARD_DIRECTIVES, MdButton, LoadingComponent, PageLoadingComponent, LoadingContainer],
  providers: [IndexedDBService],
  inputs: ['name']
})
@Routes([
  { path: '/', component: RoutedemoComponent },
  { path: '/routedemo', component: RoutedemoComponent },
  { path: '/routetest', component: RoutetestComponent },
  { path: '/httpdemo', component: HttpDemo }
])
export class EmsAppComponent extends Base implements OnActivate, CanDeactivate {

  wxbDB = {
    name: "wxb",
    version: 1,
    db: null
  };

  initDB(dbObj: dbInfo) {
    dbObj.version = dbObj.version || 1;

    let request: IDBOpenDBRequest = indexedDB.open(dbObj.name, dbObj.version);
    request.onerror = function (e) {
      // console.log(e.Target);

    };


    request.onsuccess = function (e) {
      dbObj.db = request.result;
      console.log(e.target);
      console.log(dbObj.db);
      usedatabase(dbObj.db);

    };
    request.onblocked = (e) => {
      alert("Please close all other tabs with this site open!");
    }

    //usedatabase(db)
    // (dbObj.db as any).onversionchange
    let usedatabase = (db) => {
      db.onversionchange = function (event) {
        dbObj.db.close();
        alert("A new version of this page is ready. Please reload!");
      };
    }

    request.onupgradeneeded = function (e) {
      let thisDB: IDBDatabase = (<IDBOpenDBRequest>e.target).result;
      if (!thisDB.objectStoreNames.contains("material")) {
        let objStore = thisDB.createObjectStore("material", { keyPath: "id", autoIncrement: true });
        objStore.createIndex("wxid", "wxid", { unique: true });
      }
      if (!thisDB.objectStoreNames.contains("account")) {
        let objStore = thisDB.createObjectStore("account", { keyPath: "id", autoIncrement: true });
        objStore.createIndex("wxid", "wxid", { unique: true });
        objStore.createIndex("nickName", "nickName", { unique: false });
      }
      if (!thisDB.objectStoreNames.contains("employees")) {
        let employeeStore = thisDB.createObjectStore("employees", { keyPath: "id" });
        employeeStore.createIndex("stateIndex", "state", { unique: false });
        employeeStore.createIndex("emailIndex", "email", { unique: true });
        employeeStore.createIndex("zipCodeIndex", "zip_code", { unique: false });
      }
      usedatabase(thisDB);
    };
  }

  addData(dbObj: dbInfo, tableName: string, data: any, cb: Function) {
    try {
      console.log(dbObj.db);
      let transaction = dbObj.db.transaction(tableName, 'readwrite');
      transaction.oncomplete = function () {
        console.log("transaction complete");
      };
      transaction.onerror = function (event) {
        console.dir(event)
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

  deleteData(dbObj: dbInfo, tableName: string, id: number, cb: Function) {
    let transaction = dbObj.db.transaction(tableName, 'readwrite');
    transaction.oncomplete = function () {
      console.log("transaction complete");
    };
    transaction.onerror = function (event) {
      console.dir(event)
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
    }
  }

  getDataAll(dbObj: dbInfo, tableName: string, cb: Function) {
    let transaction = dbObj.db.transaction(tableName, 'readonly');
    transaction.oncomplete = function () {
      console.log("transaction complete");
    };
    transaction.onerror = function (event) {
      console.dir(event);
    };

    let objectStore = transaction.objectStore(tableName);
    let rowData = []; //IDBKeyRange.lowerBound("'E6'", true)
    objectStore.openCursor(IDBKeyRange.lowerBound("E6")).onsuccess = (e) => {
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

  getDataById(dbObj: dbInfo, tableName, id, cb) {
    var transaction = dbObj.db.transaction(tableName, 'readwrite');
    transaction.oncomplete = function () {
      console.log("transaction complete");
    };
    transaction.onerror = function (event) {
      console.dir(event)
    };

    var objectStore = transaction.objectStore(tableName);
    var request = objectStore.get(id);

    request.onsuccess = function (e) {
      if (cb) {
        cb({
          error: 0,
          data: (e.target as any).result
        })
      }
    };

    request.onerror = function (e) {
      if (cb) {
        cb({
          error: 1
        });
      }
    }

  }

  getDataBySearch(dbObj: dbInfo, tableName: string, keywords, cb: Function) {
    var transaction = dbObj.db.transaction(tableName, 'readwrite');
    transaction.oncomplete = function () {
      console.log("transaction complete");
    };
    transaction.onerror = function (event) {
      console.dir(event)
    };

    var objectStore = transaction.objectStore(tableName);
    var boundKeyRange = IDBKeyRange.only(keywords);
    var rowData;
    objectStore.index("nickName").openCursor(boundKeyRange).onsuccess = function (event) {
      var cursor = (event.target as any).result;
      if (!cursor) {
        if (cb) {
          cb({
            error: 0,
            data: rowData
          })
        }
        return;
      }
      rowData = cursor.value;
      cursor.continue();
    };
  }

  getDataByPager(dbObj: dbInfo, tableName: string, start: number, end: number, cb: Function) {
    var transaction = dbObj.db.transaction(tableName, 'readwrite');
    transaction.oncomplete = function () {
      console.log("transaction complete");
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

  updateData(dbObj: dbInfo, tableName: string, id: number, updateData: any, cb: Function) {
    let transaction = dbObj.db.transaction(tableName, 'readwrite');
    transaction.oncomplete = function () {
      console.log("transaction complete");
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
    }
  }

  closeDB(dbObj: dbInfo) {
    dbObj.db.close();
  }

  deleteDB(dbObj: dbInfo) {
    indexedDB.deleteDatabase(dbObj.name);
  }

  constructor(private router: Router, private idxSrv: IndexedDBService) {
    super();
    this.name = "mainapp";
    this.getComps.set(this.name, this);
    // this.pageLoading = true;
    // // this.router.navigate(['/routetest']);
    // Rx.Observable.timer(1000, 100).take(1).subscribe(x => {
    //   this.pageLoading = false;
    // });
    // this.root.name = "root";
    // this.root.parent = null;
    // this.root.childs.push({ name: "child1", parent: "root", childs: [{ name: "child11", parent: "child1", childs: [] }, { name: "child12", parent: "child1", childs: [] }] }, { name: "child2", parent: "root", childs: [] });
    console.log(this.root);
    console.log(this.expandByLevel(this.root));
    console.log(this.expand(this.root));
    idxSrv.deleteDB(this.idxSrv.schema);
    idxSrv.initDB(this.idxSrv.schema);
    //  this.deleteDB(this.wxbDB);
    //  this.initDB(this.wxbDB);

  }
  alldata: any;
  title = 'Enterprise Information Portal System';
  //moment:moment = (<any>moment)['default'] || moment;
  navRoute() {
    //this.pageLoading = true;
    // Rx.Observable.timer(1000, 100).take(1).subscribe(x => {
    //  this.pageLoading = false;
    // });
    this.router.navigate(['/routedemo']);

  }
  root = {
    name: "root", parent: null, childs: [
      {
        name: "child1", parent: "root", childs:
        [
          { name: "child11", parent: "child1", childs: [] },
          { name: "child12", parent: "child1", childs: [] }
        ]
      },
      {
        name: "child2", parent: "root", childs:
        [
          {
            name: "child21", parent: "child2", childs:
            [
              { name: "child211", parent: "child21", childs: [] },
              { name: "child212", parent: "child21", childs: [] }
            ]
          },
          { name: "child22", parent: "child2", childs: [] }
        ]
      }
    ]
  };

  expand(nodeObj: any) {
    let nodeLists = new Array<string>();
    nodeLists.push(nodeObj.name);
    nodeObj.childs.forEach(node => {
      nodeLists = nodeLists.concat(this.expand(node));
    });
    return nodeLists;
  }

  expandByLevel(nodeObj) {
    let nodeLists = new Array<string>();
    let nodeChilds = [nodeObj];
    while (nodeChilds.length > 0) {
      let curNode = nodeChilds.shift();
      if (curNode.parent === null) {
        nodeLists.push(curNode.name);
      }
      curNode.childs.forEach(node => {
        nodeChilds.push(node);
        nodeLists = nodeLists.concat(node.name);
      });
    }
    return nodeLists;
  }

  ngOnDestroy() {
    this.deleteDB(this.wxbDB);
  }

  ngOnInit() {
    // let clicks = Rx.Observable.fromEvent(document, 'click');
    // let delayedClicks = clicks.delayWhen(event => Rx.Observable.fromEvent(document, 'keydown'), Rx.Observable.fromEvent(document, 'dblclick'));
    // delayedClicks.subscribe(x => console.log(x));
    // console.log("routerOnActivateAtEmsApp");

    // routerOnActivate() {
    //   // this.pageLoading = true;
    //   // Rx.Observable.timer(3000, 100).take(1).subscribe(x => {
    //   //   this.pageLoading = false;
    //   // });
    //   super.routerOnActivate();
    // }
    let emps = [];
    //   "id": "E5",
    //   "first_name": "Jane5",
    //   "last_name": "Doh5",
    //   "email": "jane.doh@somedomain.com",
    //   "street": "123 Pennsylvania Avenue",
    //   "city": "Washington D.C.",
    //   "state": "DC",
    //   "zip_code": "20500",
    // },
    //   {
    //     "id": "E6",
    //     "first_name": "Jane6",
    //     "last_name": "Doh6",
    //     "email": "jane.doh6@somedomain.com",
    //     "street": "123 Pennsylvania Avenue",
    //     "city": "Washington D.C.",
    //     "state": "DC",
    //     "zip_code": "20503",
    //   },
    //   {
    //     "id": "E7",
    //     "first_name": "Jane7",
    //     "last_name": "Doh7",
    //     "email": "jane.doh7@somedomain.com",
    //     "street": "123 Pennsylvania Avenue",
    //     "city": "Washington D.C.",
    //     "state": "DC",
    //     "zip_code": "20501",
    //   },
    //   {
    //     "id": "E8",
    //     "first_name": "Jane8",
    //     "last_name": "Doh7",
    //     "email": "jane.doh8@somedomain.com",
    //     "street": "1238 Pennsylvania Avenue",
    //     "city": "Washington D.C.",
    //     "state": "DC8",
    //     "zip_code": "205018",
    //   }
    // ];

    for (var index = 0; index < 100; index++) {
      let aa = {
        "id": "E8" + index,
        "first_name": "Jane8" + index,
        "last_name": "Doh7",
        "email": "jane.doh8@somedomain.com" + index,
        "street": "1238 Pennsylvania Avenue",
        "city": "Washington D.C.",
        "state": "DC8" + index,
        "zip_code": "205018" + index,
      };
      emps.push(aa);

    }

    let taska = new Rx.ReplaySubject<any>();
    let taskb = new Rx.ReplaySubject<any>();
    Rx.Observable.interval(100).subscribe((res) => {
      if (taska && taskb) {

      }
    });
    setTimeout(() => {
      // this.addData(this.idxSrv.schema, "employees", emps, (res) => this.alldata = JSON.stringify(res.data));
      this.idxSrv.insert("employees", emps)
        .subscribe(res => {
          this.alldata = JSON.stringify(res);
          taska.next(true);
        }
        );
    }, 3000); //(err, data) => this.alldata = JSON.stringify(data))

    setTimeout(() => {
      // this.getDataAll(this.idxSrv.schema, "employees", (res) => this.alldata = JSON.stringify(res.data));
      this.idxSrv.find("employees",
        (emp: employee) => {
          return emp.id === '1465647975086' &&
            emp.email.includes('doh8') || emp.id >= '1465648239843';
        })  //
        .subscribe(res => {
          this.alldata = JSON.stringify(res);
          taskb.next(true);
        }
        );
    }, 20000);

    setTimeout(() => {
      this.idxSrv.update("employees",
        { first_name: 'jane66', last_name: 'lastname888' },
        (emp: employee) => emp.id === '1465647975059' || emp.id >= '1465647975086')
        .subscribe(
        res => this.alldata = JSON.stringify(res)
        );
      // this.idxSrv.updateData("employees", 'E80', { first_name: "jane666666" }, (err, data) => { this.alldata = JSON.stringify(data) });
    }, 10000);

    // let elt :string;,
    //  (err, data) => this.alldata = JSON.stringify(data)

    this.queueScheduler();

    // });
  }

  queueScheduler() {
    let call1 = false;
    let call2 = false;
    let called = false;

    Rx.Scheduler.queue.active = false;
    Rx.Scheduler.queue.schedule(() => {
      call1 = true;
      console.log("queue one.");
      Rx.Scheduler.queue.schedule(() => {
        call2 = true;
        console.log("queue two.");
      });
    });

    Rx.Scheduler.queue.schedule(() => {
      called = true;
    }, 60);

    setTimeout(() => {
      // expect(called).toBe(false);
      console.log(called);
    }, 20);

    setTimeout(() => {
      // expect(called).toBe(true);
      console.log(called);
      this.done('called');
    }, 100);

    let actionHappened = false;
    let firstSubscription = null;
    let secondSubscription = null;

    firstSubscription = Rx.Scheduler.asap.schedule(() => {
      actionHappened = true;
      if (secondSubscription) {
        secondSubscription.unsubscribe();
      }
      // Rx.Observable.timer(1000).subscribe(x => {
      //   this.done("first");
      // })
      this.done("first");

      //  this.done("first");


      this.done(new Error('The first action should not have executed.'));
    });

    secondSubscription = Rx.Scheduler.asap.schedule(() => {
      if (!actionHappened) {
        this.done(" second one actionHappened");
      }
      Rx.Observable.timer(1000).subscribe(x => {
        this.done(" second two actionHappened");
      })
      this.done(" Second three actionHappened");
    });

    if (actionHappened) {
      this.done(new Error('Scheduled action happened synchronously'));
    } else {
      firstSubscription.unsubscribe();
    }

    const results = [];
    Rx.Scheduler.queue.schedule(() => {
      results.push(1);
      console.log('111');
    });
    Rx.Scheduler.queue.schedule(() => {
      // throw new Error('bad');
      this.done(new Error('bad'));
      console.log('222');
    });


    setTimeout(() => {
      Rx.Scheduler.queue.schedule(() => {
        results.push(2);
        console.log('333');
        this.done(results);
      });
    }, 0);

    let observable = Rx.Observable.create(function (proxyObserver) {
      proxyObserver.next(1);
      proxyObserver.next(2);
      proxyObserver.next(3);
      proxyObserver.complete();
    }).observeOn(Rx.Scheduler.queue);

    let finalObserver = {
      next: x => console.log('got value ' + x),
      error: err => console.error('something wrong occurred: ' + err),
      complete: () => console.log('scheduler done'),
    };

    console.log('just before subscribe');
    observable.subscribe(finalObserver);
    console.log('just after subscribe');

    setInterval(() => {
      for (var index = 0; index < 10; index++) {
        console.log('IntervalA:' + index);
      }
    }, 1000);
    setInterval(() => {
      for (var index = 0; index < 10; index++) {
        console.log('IntervalB:' + index);

      }
    }, 998);


  }

  done(obj: any) {
    console.log(obj);
  }


  like(val1, val2) {
    return (new RegExp(val2, 'i')).test(val1);
  }
  updatedata() {
    this.idxSrv.updateResult('employees', { first_name: "jane666666", last_name: "last_name80" });
    // this.idxSrv.updateData("employees", "'E80'", { first_name: "jane666666" }, (err, data) => { this.alldata = JSON.stringify(data) });
  }



}

// String.prototype.like = function (value: string) {
//   return (new RegExp(value, 'i')).test(this);
// };


interface employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
}
/**
 * test
 */
class test {
  /**
   *
   */
  constructor() {
    this.childs = new Array<test>();
    let jim = extend(new Person("Jim"), new ConsoleLogger());
    let n = jim.name;
    let t: Tree<Person>;
    let t1: Container<Person>;
    jim.log();
    let result = <string & Person>{};

  }
  name: string;
  parent: string;
  childs: Array<test>;
}

interface dbInfo {
  name: string;
  version: number;
  db: IDBDatabase;
}

function extend<T, U>(first: T, second: U): T & U {
  let result = <T & U>{};
  for (let id in first) {
    (<any>result)[id] = (<any>first)[id];
  }
  for (let id in second) {
    if (!result.hasOwnProperty(id)) {
      (<any>result)[id] = (<any>second)[id];
    }
  }
  return result;
}

class Person {
  constructor(public name: string) {

  }
  like(val1, val2) {
    return (new RegExp(val2, 'i')).test(val1);
  }
}

interface Loggable {
  log(): void;
}
class ConsoleLogger implements Loggable {
  log() {
    // ...
  }
}

type Container<T> = { value: T };


//类型与接口的区别
type Tree<T> = {
  value: T;
  left: Tree<T>;
  right: Tree<T>;
}

// type LinkedList<T> = T & { next: LinkedList<T> };
// var people: LinkedList<Person>;
// var s = people.name;
// var s = people.next.name;
// var s = people.next.next.name;
// var s = people.next.next.next.name;

// Disposable Mixin
class Disposable {
  isDisposed: boolean;
  dispose() {
    this.isDisposed = true;
  }

}

// Activatable Mixin
class Activatable {
  isActive: boolean;
  activate() {
    this.isActive = true;
  }
  deactivate() {
    this.isActive = false;
  }
}

class SmartObject implements Disposable, Activatable {
  constructor() {
    setInterval(() => console.log(this.isActive + " : " + this.isDisposed), 500);
  }

  interact() {
    this.activate();
  }

  // Disposable
  isDisposed: boolean = false;
  dispose: () => void;
  // Activatable
  isActive: boolean = false;
  activate: () => void;
  deactivate: () => void;
}
applyMixins(SmartObject, [Disposable, Activatable]);
//applyMixins(String, [stringExtend]);

// String.prototype.like = function (value: string) {
//   return (new RegExp(value, 'i')).test(this);
// };

let smartObj = new SmartObject();
setTimeout(() => smartObj.interact(), 1000);

////////////////////////////////////////
// In your runtime library somewhere
////////////////////////////////////////

function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      derivedCtor.prototype[name] = baseCtor.prototype[name];
    });
  });
}

/**
 * stringExtend
 */
class stringExtend {
  constructor() {

  }
  like = function (value: string) {
    return (new RegExp(value, 'i')).test(this);
  };
}