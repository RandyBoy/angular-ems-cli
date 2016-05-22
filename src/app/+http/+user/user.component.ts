import { Component, OnInit, Input } from '@angular/core';
import { OnActivate, Router, RouteSegment, RouteTree } from '@angular/router';
import { HttpService } from '../http.service';
import { User } from '../../../service/model';
import {Base} from '../../base';

@Component({
    moduleId: module.id,
    selector: 'user',
    templateUrl: 'user.component.html'
})
export class UserComponent extends Base implements OnInit, OnActivate {
    private id: string;
    private user: User = {
        name: '',
        age: 0,
        imageUrl: '',
        createdAt: 0,
        id: ''
    };

    constructor(private service: HttpService, curr: RouteSegment) {
        super();
        this.id = curr.getParam('id');
    }

    ngOnInit() {
        this.service.getUser(this.id).subscribe(user => {
            this.user = user
            console.log(user)
        });
    }
    routerOnActivate(): void { //curr: RouteSegment, prev?: RouteSegment, currTree?: RouteTree, prevTree?: RouteTree
        super.routerOnActivate();
    }


}