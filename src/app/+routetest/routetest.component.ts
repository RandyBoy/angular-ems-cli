import { Component, OnInit, OnChanges, DynamicComponentLoader, Injector, ViewContainerRef } from '@angular/core';
import * as Rx from 'rxjs/Rx';
import { OnActivate, CanDeactivate } from '@angular/router';
import {Base} from '../base';
//import PageLoading from '../services/PageLoading';
import {PageLoadingComponent} from '../loading/pageloading.component';
import {LoadingContainer} from '../loading/loadingcontainer';

@Component({
  moduleId: module.id,
  selector: 'app-routetest',
  templateUrl: 'routetest.component.html',
  styleUrls: ['routetest.component.css'],
  directives: [LoadingContainer],
  inputs:['name']

})
export class RoutetestComponent extends Base implements OnInit, OnActivate, OnChanges, CanDeactivate {

  constructor(private dcl: DynamicComponentLoader, private viewContainerRef: ViewContainerRef) {
    super();
    this.name = "testcmp";
    this.getComps.set(this.name,this);
    this.anyncData();
  }
  anyncData() {
    this.startLoading();
    setTimeout(() => { this.endLoading() }, 3000);
  }
  ngOnInit() {

  }
  routerOnActivate() {
    // console.log("routetesta:" + this.pageLoading);
    // this.pageLoading = true;
    // Rx.Observable.timer(5000, 100).take(1).subscribe(x => {
    //   this.pageLoading = false;
    // });
    // console.log("routerOnActivateAtRoutetest");
    // this.dcl.loadNextToLocation(PageLoadingComponent, this.viewContainerRef);
    // this.showPageLoading("random");
    super.routerOnActivate();
  }
  ngOnChanges() {
    console.log("routetestaaa:" + this.pageLoading);
  }
  again() {
    this.startLoading();
    setTimeout(() => {
      this.endLoading();
    }, 3000);
    let rootCmp = this.getComps.get("mainapp");
    console.log(rootCmp);
    //console.log(rootCmp.expand(rootCmp.root));
    console.log(rootCmp.expandByLevel(rootCmp.root));
    console.log(rootCmp.name);
  }

}
