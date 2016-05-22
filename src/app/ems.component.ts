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
  directives: [ROUTER_DIRECTIVES, MdCheckbox, MD_CARD_DIRECTIVES, MdButton, LoadingComponent, PageLoadingComponent,LoadingContainer]
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


  ngOnInit() {
    // let clicks = Rx.Observable.fromEvent(document, 'click');
    // let delayedClicks = clicks.delayWhen(event => Rx.Observable.fromEvent(document, 'keydown'), Rx.Observable.fromEvent(document, 'dblclick'));
    // delayedClicks.subscribe(x => console.log(x));
    // console.log("routerOnActivateAtEmsApp");
  }
  routerOnActivate() {
    // this.pageLoading = true;
    // Rx.Observable.timer(3000, 100).take(1).subscribe(x => {
    //   this.pageLoading = false;
    // });
  }

}
