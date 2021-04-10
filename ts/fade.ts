import { mapAndBound } from './util';

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
    private minOpacity: number;
    private maxOpacity: number;
    public fadeItems: NodeListOf<HTMLElement>;

    public constructor(className: string, sInterval: number, mInterval: number, minOpacity: number, maxOpacity: number) {
        this.interval = 5000;
        this.opacity = maxOpacity;
        this.fadeItems = document.querySelectorAll(className);
        this.startInterval = sInterval;
        this.maxInterval = mInterval;
        this.minOpacity = minOpacity;
        this.maxOpacity = maxOpacity;
    }

    public step(): void {
        this.interval = this.interval > 0 ? this.interval - 5 : this.interval;
        this.opacity = mapAndBound(this.interval, 0, 1500, this.minOpacity, this.maxOpacity);
        this.fadeItems.forEach((elem: HTMLElement) => {
            elem.style.opacity = this.opacity.toString();
        });
    }

    public onMouseMove(): void {
        this.interval = this.interval > this.maxInterval + 2000 ? this.interval : this.interval + 100;
    }
}

export const getItemFade = (className: string, minOpacity: number, maxOpacity: number): Fade => {
    return new ItemFade(`.${className}`, 4500, 2000, minOpacity, maxOpacity);
};
