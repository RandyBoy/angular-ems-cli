import { Component, OnInit } from '@angular/core';
import { ChildrouterComponent } from './+childrouter';
import { Routes, ROUTER_DIRECTIVES, OnActivate, CanDeactivate} from '@angular/router';
import * as Rx from 'rxjs/Rx';
import {Base} from '../base';
@Component({
  moduleId: module.id,
  selector: 'app-routedemo',
  templateUrl: 'routedemo.component.html',
  styleUrls: ['routedemo.component.css'],
  directives: [ROUTER_DIRECTIVES]
})
@Routes([
  { path: '/childrouter', component: ChildrouterComponent }
])
export class RoutedemoComponent extends Base implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
    // console.log("Init:routerOnActivateAtRoutedemo");
  }

  routerOnActivate(): void {

    super.routerOnActivate();
  }

}
