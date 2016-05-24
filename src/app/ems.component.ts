import { Component } from '@angular/core';
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
@Component({
  moduleId: module.id,
  selector: 'ems-app',
  templateUrl: 'ems.component.html',
  styleUrls: ['ems.component.css'],
  directives: [ROUTER_DIRECTIVES, MdCheckbox, MD_CARD_DIRECTIVES, MdButton, LoadingComponent, PageLoadingComponent, LoadingContainer]
})
@Routes([
  { path: '/', component: RoutedemoComponent },
  { path: '/routedemo', component: RoutedemoComponent },
  { path: '/routetest', component: RoutetestComponent },
  { path: '/httpdemo', component: HttpDemo }
])
export class EmsAppComponent extends Base implements OnActivate, CanDeactivate {

  /**
   *<alert type="info">ng2-bootstrap hello world!</alert>
   */
  constructor(private router: Router) {
    super();

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
  }
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


  ngOnInit() {
    // let clicks = Rx.Observable.fromEvent(document, 'click');
    // let delayedClicks = clicks.delayWhen(event => Rx.Observable.fromEvent(document, 'keydown'), Rx.Observable.fromEvent(document, 'dblclick'));
    // delayedClicks.subscribe(x => console.log(x));
    // console.log("routerOnActivateAtEmsApp");
  }
  // routerOnActivate() {
  //   // this.pageLoading = true;
  //   // Rx.Observable.timer(3000, 100).take(1).subscribe(x => {
  //   //   this.pageLoading = false;
  //   // });
  //   super.routerOnActivate();
  // }



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

  }
  name: string;
  parent: string;
  childs: Array<test>;
}
