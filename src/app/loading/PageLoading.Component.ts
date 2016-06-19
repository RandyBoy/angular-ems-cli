/// <reference path="../../typings.d.ts" />
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import {TimerWrapper} from '@angular/common/src/facade/async';
import { Base } from '../base';
import * as pageLoadingEffects from './pageloadingeffects';
import * as Rx from 'rxjs/rx';

@Component({
    moduleId: module.id,
    selector: 'pageloading',
    templateUrl: 'pageloading.component.html',
    styleUrls: ['pageloading.component.css'],
    directives: [NgIf, NgClass]
})
export class PageLoadingComponent extends Base implements OnInit {
    autoPageLoading: boolean = true;
    effect: string = 'random';
    timeOut: number = 500;
    animateOpt: any;
    isAnimating: boolean;
    el: HTMLElement;
    options: any;
    pageLoad: boolean;
    checkStream = Rx.Observable.interval(100);
    constructor() {
        super();
        this.pageLoadingStream.subscribe((v: any) => {
            if (v.m === "show") {
                this.showLoading();
            }
            if (v.m === "hide") {
                this.Hide();
            }
        });
    }

    ngOnInit() {

    }

    showLoading() {
        let checkSubscriber = this.checkStream.subscribe((i) => {
            if (this.pageShow === false && this.pageLoading) {
                this.pageLoading = false;
            }
            if (!this.pageShow && !this.pageLoading) {
                checkSubscriber.unsubscribe();
            }
        });
        this.AnimateInit({ el: "#paper", effect: "random" });
        this.Show(this.effect);
        setTimeout(() => { this.Hide(); }, 1860);
        //Snap("#paper").parent().node.className.replace("show", "");
    }
    //     if (window.addEventListener) {
    //     var range = document.querySelector("#range"), circle = document.querySelectorAll("circle")[1];
    //     if (range && circle) {
    //         range.addEventListener("change", function() {
    //             var percent = this.value / 100, perimeter = Math.PI * 2 * 170;
    //             circle.setAttribute('stroke-dasharray', perimeter * percent + " " + perimeter * (1- percent));
    //         });
    //     }
    // }

    draw() {
        let dom = Snap("#svgpaper");
        let svgel = Snap(100, 100).circle(50, 50, 40).attr({
            fill: "#fc0",
            stroke: "#000",
            strokeWidth: 2,
            "fill-opacity": 0.5
        }).drag();
        dom.add(svgel);
        let f = dom.filter(Snap.filter.grayscale(0.8));
        dom.image("/app/loading/html.jpg", 0, 0, 1440, 900).attr({ filter: f }).drag();
        dom.text(10, 100, "drawText").drag();

        Snap("#svgpaper").circle(10, 20, 10)
            .drag()
            .dblclick((event: MouseEvent) => { console.log("draw"); })
            .clone().attr({ cx: 15, fill: "blue" }).drag();

        let f1 = dom.filter(Snap.filter.shadow(0, 2, 3));
        let c = dom.circle(130, 150, 40).attr({
            fill: "red",
            filter: f1
        }).drag();

    }


    public get path(): Snap.Element {
        return Snap("#paper").select("path");
    }


    AnimateInit(options) {
        // this.svg = Snap("#paper"); <img style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67"
        //alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png">    
        this.options = options;
        this.options.speedIn = 500;
        this.options.easingIn = 'linear';
        this.effect = options.effect || 'random';
        this.animateOpt = null;
        this.isAnimating = false;
        this.pageShow = false;
        this.pageLoading = false;
        // Rx.Observable.of(1).subscribe((i) => {
        //     Rx.Observable.timer(1000, 800).take(10).subscribe((i) => console.log("timer:" + i), (err) => { }, () => { console.log("timer1complete") });
        //     Rx.Observable.timer(1000, 800).subscribe((i) => console.log("Range:" + i), (err) => { }, () => { console.log("Rangecomplete") });
        // }, (err) => { }, () => { console.log("ofcomplete") });
        // var clicks = Rx.Observable.fromEvent(document, 'click');
        // var parts = clicks.partition((ev: any) => ev.target.tagName === 'DIV');
        // var clicksOnDivs = parts[0];
        // var clicksElsewhere = parts[1];
        // clicksOnDivs.subscribe((x: MouseEvent) => console.log('DIV clicked: ', x.type));
        // clicksElsewhere.subscribe(x => console.log('Other clicked: ', x));
        // var result = clicks.debounce(ev => Rx.Observable.interval(1000));
        // result.subscribe((x: MouseEvent) => console.log("debounce:" + x.type));
        // var result2 = clicks.throttle(ev => Rx.Observable.interval(1000));
        // result2.subscribe((x: MouseEvent) => console.log("throttle:" + x.type));
        // var keydownclicks = Rx.Observable.fromEvent(document, 'keydown');
        // var result3 = keydownclicks.debounce(ev => Rx.Observable.interval(1000));
        // result3.subscribe((x: KeyboardEvent) => console.log(x));
        // keydownclicks.throttle(ev => Rx.Observable.interval(1000)).subscribe((x: KeyboardEvent) => console.log(x));
        // clicks.switchMap((ev) => Rx.Observable.interval(1000)).subscribe(x => console.log(x));
    }

    GetOpt(newEffect: string) {
        let effect, effects, effectObj, initialPath, openingSteps, openingStepsStr, openingStepsTotal, closingSteps, closingStepsStr,
            closingStepsTotal, animateOpt, speedOut, easingOut;

        effect = newEffect || effect;
        effects = Object.keys(pageLoadingEffects.pageLoadingEffects);

        if (effect === 'random' || effects.indexOf(effect) < 0) {
            effect = effects[Math.floor(Math.random() * 13)]
        }
        effectObj = pageLoadingEffects.pageLoadingEffects[effect];

        initialPath = effectObj.path;

        openingStepsStr = effectObj.opening;
        openingSteps = openingStepsStr ? openingStepsStr.split(';') : '';
        openingStepsTotal = openingStepsStr ? openingSteps.length : 0;

        if (openingStepsTotal === 0) {
            return false;
        }

        closingStepsStr = effectObj.closing || initialPath;
        closingSteps = closingStepsStr ? closingStepsStr.split(';') : '';
        closingStepsTotal = closingStepsStr ? closingSteps.length : 0;

        speedOut = effectObj.speedOut || effectObj.speedIn;
        easingOut = effectObj.easingOut || effectObj.easingIn;

        animateOpt = {
            initialPath: initialPath,
            openingSteps: openingSteps,
            openingStepsTotal: openingStepsTotal,
            closingSteps: closingSteps,
            closingStepsTotal: closingStepsTotal,
            speedOut: speedOut,
            easingOut: easingOut,
            speedIn: effectObj.speedIn,
            easingIn: effectObj.easingIn
        };

        return animateOpt;
    }
    getClass() {
        return {
            "show": this.pageShow,
            "pageloading-loading": this.pageLoading,
            "pageload-overlay": true
        };
    }

    Show(newEffect: string) {
        let animateOpt;
        if (this.isAnimating || (this.pageLoading || this.pageShow)) {
            return false;
        }
        animateOpt = this.GetOpt(newEffect);
        if (!animateOpt) {
            return;
        }
        this.path.attr({ d: animateOpt.initialPath });
        this.animateOpt = animateOpt;
        this.isAnimating = true;
        this.pageLoading = true;
        let cbk = () => this.pageLoading = true;
        this.AnimateSVG('in', animateOpt, cbk);
        this.pageShow = true;
    }

    Hide() {
        let animateOpt = this.animateOpt;
        if (!animateOpt) { // have stopped or is stopping the animation, just return
            return false;
        }
        this.animateOpt = null; // prevent hide one animation multi times
        this.pageLoading = false;
        let cbk = () => {
            this.pageShow = false;
            this.isAnimating = false;
        };
        this.AnimateSVG('out', animateOpt, cbk);
    }

    AnimateSVG(dir, animateOpt, cbk) {
        let pos = 0,
            steps = dir === 'out' ? animateOpt.closingSteps : animateOpt.openingSteps,
            stepsTotal = dir === 'out' ? animateOpt.closingStepsTotal : animateOpt.openingStepsTotal,
            speed = dir === 'out' ? animateOpt.speedOut : animateOpt.speedIn,
            easing = dir === 'out' ? animateOpt.easingOut : animateOpt.easingIn,
            nextStep;

        easing = mina[easing] || mina.linear;
        nextStep = (pos) => {
            if (pos > stepsTotal - 1) {
                if (cbk && typeof cbk == 'function') {
                    cbk();
                }
                return;
            }
            this.path.animate({ 'path': steps[pos] }, speed, easing, () => {
                nextStep(pos);
            });
            pos++;
        };

        nextStep(pos);
    }


}