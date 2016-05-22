
import PageLoadingService from '../app/services/PageLoadingService';
import * as Rx from 'rxjs/Rx';

export class Base {
    loadingStream: Rx.Subject<any>;
    constructor() {
        this.loadingStream = new Rx.Subject<any>();
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

    // public get loadingStream(): Rx.Subject<any> {
    //     if (!this.loadingStream_) {
    //         this.loadingStream_ = new Rx.Subject<any>();
    //     }
    //     return this.loadingStream_;
    // }

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
        //this.loadingStream.next({ m: "ready" });
        this.isloading = false;
    }
    startLoading() {
       // this.loadingStream.next({ m: "standby" });
       this.isloading = true;
    }








}