import { Component, OnInit } from '@angular/core';
import * as Rx from 'rxjs/Rx';
import { OnActivate, CanDeactivate } from '@angular/router';
//import PageLoading from '../../services/PageLoading';
import {Base} from '../../base';
@Component({
  moduleId: module.id,
  selector: 'app-childrouter',
  templateUrl: 'childrouter.component.html',
  styleUrls: ['childrouter.component.css']
})
export class ChildrouterComponent extends Base implements OnInit, OnActivate, CanDeactivate {

  constructor() {
    super();
  }

  ngOnInit() {
  }

  routerOnActivate() {
    super.routerOnActivate();
  }

}
