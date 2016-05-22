import { Component, OnInit } from '@angular/core';
import { OnActivate, CanDeactivate, Router, RouteTree, RouteSegment, Routes, ROUTER_DIRECTIVES } from '@angular/router';
import { HttpService } from './http.service';
import { UserComponent } from './+user/user.component';
import {Base} from '../base';
import { User } from '../../service/model';
import * as Rx from 'rxjs/Rx';
@Component({
    moduleId: module.id,
    selector: 'http',
    providers: [HttpService],
    templateUrl: 'http.demo.html',
    styleUrls: ['http.demo.css'],
    directives: [ROUTER_DIRECTIVES]
})

@Routes([
    { path: 'user/:id', component: UserComponent }
])

export class HttpDemo extends Base implements OnInit, OnActivate, CanDeactivate {
    datas: Array<User> = [{ "id": "1", "createdAt": 1463284019, "name": "name 1", "imageUrl": "http://img.t.sinajs.cn/t5/skin/public/profile_cover/012_s.jpg?version=4cf86e6ee302e1bc", "age": 83 },
        { "id": "6", "createdAt": 1463283719, "name": "name 6", "imageUrl": "http://img.t.sinajs.cn/t5/skin/public/profile_cover/012_s.jpg?version=4cf86e6ee302e1bc", "age": 56 },
        { "id": "7", "createdAt": 1463283659, "name": "name 7", "imageUrl": "http://img.t.sinajs.cn/t5/skin/public/profile_cover/012_s.jpg?version=4cf86e6ee302e1bc", "age": 43 },
        { "id": "86", "createdAt": 1463278925, "name": "name 86", "imageUrl": "http://img.t.sinajs.cn/t5/skin/public/profile_cover/012_s.jpg?version=4cf86e6ee302e1bc", "age": 45 }];
    private users: User[] = [];
    constructor(private httpservice: HttpService) {
        super();

    }

    ngOnInit() {
        this.users = this.datas;
        // this.pageLoading = true;
        // this.httpservice.getUsers().subscribe(data => {
        //     this.users = data;
        //     this.pageLoading = false;
        // });
    }
    // routerOnActivate(curr: RouteSegment, prev: RouteSegment, currTree: RouteTree): void {
    //     let id = +curr.getParam('id'); //show
    //     // this.pageLoading = true;
    //     // setTimeout(()=>this.pageLoading = false,3000);
    //    // this.showPageLoading("random");
    //   // super.routerOnActivate();
    // }

    // routerCanDeactivate(curr: RouteTree): Promise<boolean> {
    //    // this.pageShow = false;//hide
    //     return 
    // }
    gotoHeroes() {
        // let heroId = this.hero ? this.hero.id : null;
        // // Pass along the hero id if available
        // // so that the HeroList component can select that hero.
        // // Add a totally useless `foo` parameter for kicks.
        // this.router.navigate([`/heroes`, {id: heroId, foo: 'foo'}]);
    }

    del(it: User) {
        this.httpservice.del(it.id).subscribe(
            data => { this.users = this.users.filter(item => item != it) },
            err => alert(err)
        );
    }


}