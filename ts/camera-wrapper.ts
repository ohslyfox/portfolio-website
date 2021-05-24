import * as Three from "three";
import { ISceneCamera, PointF } from "./types";
import { lerp, map } from "./util";

const Z_DEFAULT = 1000;

export class CameraWrapper implements ISceneCamera {
    // static members
    private static instance: ISceneCamera | null = null;

    // instance members
    public camera: Three.PerspectiveCamera;
    private scene: Three.Scene;

    public static getCameraWrapper(scene: Three.Scene): ISceneCamera {
        if (CameraWrapper.instance === null) {
            CameraWrapper.instance = new CameraWrapper(scene);
        }
        return CameraWrapper.instance;
    }

    private constructor(scene: Three.Scene) {
        this.scene = scene;
        this.camera = new Three.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 1, 100000);
        this.camera.position.z = Z_DEFAULT;

        const getRandomInRange = (): number => {
            let res = 0;
            while (res > -500 && res < 500) {
                res = map(Math.random(), 0, 1, -2000, 2000);
            }
            return res;
        };

        this.camera.position.x = getRandomInRange();
        this.camera.position.y = getRandomInRange();
    }

    public step(mouseLocation: PointF, windowVector: PointF, mouseDown: boolean): void {
        const nextPos: PointF = mouseDown ?
            {
                x: map(mouseLocation.x, -windowVector.x, windowVector.x,
                    windowVector.x * .75, windowVector.x * -.75),
                y: map(mouseLocation.y, -windowVector.y, windowVector.y,
                    windowVector.y * -.75, windowVector.y * .75)
            }
            :
            {
                x: map(mouseLocation.x, -windowVector.x, windowVector.x,
                    windowVector.x * .125, windowVector.x * -.125),
                y: map(mouseLocation.y, -windowVector.y, windowVector.y,
                    windowVector.y * -.125, windowVector.y * .125)
            };

        this.camera.position.x = lerp(this.camera.position.x, nextPos.x, .01);
        this.camera.position.y = lerp(this.camera.position.y, nextPos.y, .01);
        this.camera.lookAt(this.scene.position);
    }

    public onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
}