/// <reference path="../../typings.d.ts" />
import {Component, Input} from '@angular/core';
import {NgSwitch, NgSwitchWhen} from '@angular/common';
import {Base} from '../base';
import * as Rx from 'rxjs/rx';

@Component({
    moduleId: module.id,
    selector: 'loading-container',
    templateUrl: 'loadingcontainer.html',
    styleUrls: ['loadingcontainer.css'],
    directives: [NgSwitch, NgSwitchWhen]
})
export class LoadingContainer extends Base {

    @Input() showLoading: boolean;

    constructor() {
        super();
        this.pageLoadingStream.subscribe((v: any) => {
            if (v.m === "standby") {
                this.again();
            }
            if (v.m === "ready") {
                this.ready();
            }
        });
    }

    again() {
        this.standby();
        setTimeout(() => {
            this.ready();
        }, 1500);
    }
}