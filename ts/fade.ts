import { DynamicDomElement } from './types';
import { mapAndBound } from './util';

export interface Fade extends DynamicDomElement {
    onMouseMove(): void;
}

class ItemFade implements Fade {
    private interval: number;
    private maxInterval: number;
    private opacity: number;
    private minOpacity: number;
    private maxOpacity: number;
    public elements: NodeListOf<HTMLElement>;

    public constructor(className: string, sInterval: number, mInterval: number, minOpacity: number, maxOpacity: number) {
        this.interval = sInterval;
        this.opacity = maxOpacity;
        this.elements = document.querySelectorAll(className);
        this.maxInterval = mInterval;
        this.minOpacity = minOpacity;
        this.maxOpacity = maxOpacity;
    }

    public step(): void {
        this.interval = Math.max(0, this.interval - mapAndBound(this.interval, 0, this.maxInterval, 10, 2));
        this.opacity = mapAndBound(this.interval, 0, 1000, this.minOpacity, this.maxOpacity);
        this.elements.forEach((elem: HTMLElement) => {
            elem.style.opacity = this.opacity.toString();
        });
    }

    public onMouseMove(): void {
        this.interval = this.interval > this.maxInterval + 5000 ? this.interval : this.interval + mapAndBound(this.interval, 0, this.maxInterval, 50, 5);
    }
}

export const getItemFade = (className: string, minOpacity: number, maxOpacity: number): Fade => {
    return new ItemFade(`.${className}`, 5000, 3000, minOpacity, maxOpacity);
};
