
import PageLoadingService from '../app/services/PageLoadingService';
import * as Rx from 'rxjs/rx';

export class Base {
    appComps: Map<string, any>;
    constructor() {
    }
    public get pageLoading(): boolean {
        return PageLoadingService.isLoading;
    }

    public set pageLoading(v: boolean) {
        PageLoadingService.isLoading = v;
    }


    public get pageShow(): boolean {
        return PageLoadingService.isShow;
    }
    public get getComps(): Map<string, any> {
        return PageLoadingService.comps;
    }
    public set pageShow(v: boolean) {
        PageLoadingService.isShow = v;
    }

    public get pageAnimate(): boolean {
        return PageLoadingService.isAnimateSVG;
    }

    public set pageAnimate(v: boolean) {
        PageLoadingService.isAnimateSVG = v;
    }

    public get pageLoadingStream(): Rx.Subject<any> {
        return PageLoadingService.pageLoadingStream;
    }

    showPageLoading(effect: string) {
        this.pageLoadingStream.next({ m: "show", p: effect });
    }
    hidePageLoading() {
        this.pageLoadingStream.next({ m: "hide" });
    }

    routerOnActivate() {
        this.showPageLoading("random");
    }
    routerCanDeactivate(): any {
        return true;
    }

    isloading: boolean;

    public loading: boolean;

    standby() {
        this.loading = true;
    }
    ready() {
        this.loading = false;
    }

    pageReady() {
        this.pageLoadingStream.next({ m: "ready" });
    }
    pageStandby() {
        this.pageLoadingStream.next({ m: "standby" });
    }

    endLoading() {
        this.isloading = false;
    }
    startLoading() {
        this.isloading = true;
    }
    name:string;



}