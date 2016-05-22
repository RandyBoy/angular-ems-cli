import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import * as Rx from 'rxjs/Rx';
import { User } from '../../service/model/user';


@Injectable()
export class HttpService {
    datas: Array<User> = [{ "id": "1", "createdAt": 1463284019, "name": "name 1", "imageUrl": "http://img.t.sinajs.cn/t5/skin/public/profile_cover/012_s.jpg?version=4cf86e6ee302e1bc", "age": 83 },
        { "id": "6", "createdAt": 1463283719, "name": "name 6", "imageUrl": "http://img.t.sinajs.cn/t5/skin/public/profile_cover/012_s.jpg?version=4cf86e6ee302e1bc", "age": 56 },
        { "id": "7", "createdAt": 1463283659, "name": "name 7", "imageUrl": "http://img.t.sinajs.cn/t5/skin/public/profile_cover/012_s.jpg?version=4cf86e6ee302e1bc", "age": 43 },
        { "id": "86", "createdAt": 1463278925, "name": "name 86", "imageUrl": "http://img.t.sinajs.cn/t5/skin/public/profile_cover/012_s.jpg?version=4cf86e6ee302e1bc", "age": 45 }];

    url = 'http://5737ef8cc0a1be11000e6895.mockapi.io/'

    users = this.url + 'users';

    constructor(private http: Http) {

    }

    getUsers(): Rx.Observable<User[]> {
        return Rx.Observable.of(this.datas);
        // return this.http.get(this.users).map(res => <User[]>res.json());
    }

    getUser(id: string): Rx.Observable<User> {

        return this.http.get(this.users + `/${id}`).map(res => <User>res.json());
    }

    del(id: string) {
        return this.http.delete(this.users + `/${id}`).map(res => <any>res.json());
    }
}