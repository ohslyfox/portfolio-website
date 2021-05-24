import * as Three from 'three'

export interface PointF {
    x: number;
    y: number;
}

export interface Color {
    r: number;
    g: number;
    b: number;
}

export interface TextureKVP {
    id: string;
    value: Three.Texture;
}

export interface MouseMoveEvent {
    clientX: number;
    clientY: number;
}

export interface KeyPressEvent {
    keyCode: number;
}

export interface DynamicDomElement {
    step(): void;
    elements: NodeListOf<Element>;
}

export interface ISceneCamera {
    step(mouseLocation: PointF, windowVector: PointF, mouseDown: boolean): void;
    onWindowResize(): void;
    camera: Three.PerspectiveCamera;
}