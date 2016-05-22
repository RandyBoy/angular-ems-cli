import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import * as Rx from 'rxjs/Rx';
import PageLoading from '../services/pageloading';
import {Base} from '../base';
@Component({
  moduleId: module.id,
  selector: 'app-loading',
  templateUrl: 'loading.component.html',
  styleUrls: ['loading.component.css'],
  directives: [NgIf]
})
export class LoadingComponent extends Base implements OnInit {
  loading_text: string = "加载中...";
  constructor() {
    super();
  }


  public get loading(): boolean {
    return PageLoading.isLoading;
  }

  public set loading(v: boolean) {
    PageLoading.isLoading = v;
  }

  ngOnInit() {
    //this.loading = true;
    this.pageLoading = true;
    Rx.Observable.timer(5000, 100).take(1).subscribe(x => {
      //  this.loading = false;
      this.pageLoading = false;

    });

  }

}
