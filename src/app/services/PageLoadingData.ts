import * as Rx from 'rxjs/Rx';
export class PageLoadingData {
  isLoading: boolean = false;
  isShow: boolean = false;
  isAnimateSVG: boolean = false;
  pageLoadingStream: Rx.Subject<any>;
  
  constructor() {
    this.pageLoadingStream = new Rx.Subject<any>();
   
  }
}