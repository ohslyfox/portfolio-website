import { map } from './util';

export interface Fade {
    interval: number;
    startInterval: number;
    maxInterval: number;
    fadeItems: NodeListOf<Element>;
    step(): void;
    onMouseMove(): void;
}

class ItemFade implements Fade {
    public interval: number;
    public startInterval: number;
    public maxInterval: number;
    private opacity: number;
    public fadeItems: NodeListOf<HTMLElement>;

    public constructor(className: string, sInterval: number, mInterval: number) {
        this.interval = 5000;
        this.opacity = 1;
        this.fadeItems = document.querySelectorAll(className);
        this.startInterval = sInterval;
        this.maxInterval = mInterval;
    }

    public step(): void {
        this.interval = this.interval > 0 ? this.interval - 5 : this.interval;
        this.opacity = map(this.interval, 0, 1500, 0, 1);
        this.fadeItems.forEach((elem: HTMLElement) => {
            elem.style.opacity = this.opacity.toString();
        });
    }

    public onMouseMove(): void {
        this.interval = this.interval > this.maxInterval ? this.interval : this.interval + 250;
    }
}

export const getItemFade = (className: string): Fade => {
    return new ItemFade(`.${className}`, 4500, 2000);
};
