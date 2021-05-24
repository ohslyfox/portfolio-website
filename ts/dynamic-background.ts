import { AmbientLight, Scene, Sprite, SpriteMaterial, Texture, TextureLoader, WebGLRenderer } from 'three';
import { Color, ISceneCamera, KeyPressEvent, MouseMoveEvent, PointF, TextureKVP } from './types';
import { lerp, mapAndBound, shadeColor } from './util';
import { Fade, getItemFade } from './fade';
import { CameraWrapper } from './camera-wrapper';

const GAP = 50, COUNT_X = 8, COUNT_Z = 35;
const PI_2 = Math.PI * 2;
const PI_2_1000_50 = (PI_2 / 1000) / 20;
const PI_2_100_50 = (PI_2 / 100) / 10;

const textureLoader = new TextureLoader();
textureLoader.crossOrigin = "";
const textures: Record<string, Texture> = {
    "CIRCLE": textureLoader.load('https://i.imgur.com/zI3V12h.png'),
    "STAR": textureLoader.load('https://i.imgur.com/FBSbt4n.png'),
    "HEART": textureLoader.load('https://i.imgur.com/lSo1E7E.png'),
    "COW": textureLoader.load('https://i.imgur.com/MDtHNhd.png'),
    "FOX": textureLoader.load('https://i.imgur.com/dQAuCU8.png')
}

// we will lerp through these colors
const patterns: Color[] = [
    { r: 255, g: 100, b: 100 },
    { r: 255, g: 255, b: 100 },
    { r: 100, g: 255, b: 100 },
    { r: 100, g: 255, b: 255 },
    { r: 175, g: 125, b: 255 },
    { r: 255, g: 100, b: 255 },
];

let camera: ISceneCamera
let scene: Scene;
let renderer: WebGLRenderer;
const particles: Sprite[] = [];

let pageFade: Fade;
let windowVector: PointF;
let mouseLocation: PointF;

let particleColor: Color;
let particleTexture: TextureKVP;
let colorIndex: number;
let secretMessage = "";
let mouseDown = false;

const counts: number[] = [];
let count = 0;

const main = () => {
    scene = new Scene();
    camera = CameraWrapper.getCameraWrapper(scene);
    renderer = new WebGLRenderer({ alpha: true });
    pageFade = getItemFade("menu-fade", 0, .67);
    windowVector = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    mouseLocation = { x: 0, y: 0 };
    colorIndex = Math.round(Math.random() * (patterns.length - 1));
    particleColor = patterns[colorIndex];
    particleTexture = getDefaultTexture();
    init();
    animate();
};

const init = (): void => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    let i = 0;
    let inc = 0;
    for (let ix = 0; ix < COUNT_X; ix++) {
        counts.push(inc);
        inc += (PI_2) / COUNT_X;
        for (let iy = 0; iy < COUNT_Z; iy++) {
            const particle = particles[i++] = new Sprite(new SpriteMaterial({ map: particleTexture.value }));
            particle.position.z = (iy * GAP) - (COUNT_Z / 3 * GAP);
            scene.add(particle);
        }
    }
    scene.add(new AmbientLight(0xFFFFFF));
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);
    document.addEventListener("mousemove", onDocumentMouseMove, false);
    document.addEventListener("mousedown", () => mouseDown = true, false);
    document.addEventListener("mouseup", () => mouseDown = false, false);
    document.addEventListener("dblclick", onDocumentClick, false);
    document.addEventListener("keypress", onKeyPress, false);
    window.addEventListener("resize", onWindowResize, false);
    onWindowResize();
}

const animate = (): void => {
    requestAnimationFrame(animate);
    render();
}

const render = (): void => {
    // frame computations
    pageFade.step();
    camera.step(mouseLocation, windowVector, mouseDown);
    stepDynamicBackground();

    // render frame
    renderer.render(scene, camera.camera);
}

const stepDynamicBackground = () => {
    let i = 0;
    for (let ix = 0; ix < COUNT_X; ix++) {
        for (let iz = 0; iz < COUNT_Z; iz++) {
            const particle = particles[i++];
            particle.position.x = 10 * (iz + 2) * Math.cos(iz + 1 * counts[ix]);
            particle.position.y = 10 * (iz + 2) * Math.sin(iz + 1 * counts[ix]);
            particle.scale.x = particle.scale.y = 7 + iz + (Math.sin(iz + count) * 6);

            const shadedColor = shadeColor(particleColor, mapAndBound(particle.scale.x, 4, 30, -80, 40));
            particle.material.color.set("rgb(" + shadedColor.r + "," + shadedColor.g + "," + shadedColor.b + ")");
        }
        counts[ix] += PI_2_1000_50;
    }
    count += PI_2_100_50;
    stepColor();
}

let colorStep = 0;
const stepColor = (): void => {
    if (colorStep >= 1) {
        colorIndex = (colorIndex + 1) % patterns.length;
        colorStep = 0;
    }
    const nextIndex = colorIndex == patterns.length - 1 ? 0 : colorIndex + 1;
    particleColor = {
        r: lerp(patterns[colorIndex].r, patterns[nextIndex].r, colorStep),
        g: lerp(patterns[colorIndex].g, patterns[nextIndex].g, colorStep),
        b: lerp(patterns[colorIndex].b, patterns[nextIndex].b, colorStep),
    };
    colorStep = Math.min(1, colorStep + 0.002);
}

const getDefaultTexture = (): TextureKVP => {
    const date = new Date();
    let key = "STAR";

    const stringDate = date.getMonth() + "/" + date.getDate();
    switch (stringDate) {
        case "1/14":
            key = "HEART";
            break;
    }

    return {
        id: key,
        value: textures[key]
    }
}

const onWindowResize = (): void => {
    // update window variable
    windowVector = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    }
    camera.onWindowResize();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

const onDocumentClick = (): void => {
    if (mouseLocation.x > -windowVector.x && mouseLocation.x < -(windowVector.x / 2)) {
        if (mouseLocation.y > windowVector.y / 2 && mouseLocation.y < windowVector.y) {
            particleTexture = secretMessage in textures ?
                {
                    id: secretMessage,
                    value: textures[secretMessage]
                } :
                {
                    id: particleTexture.id == "STAR" ? "CIRCLE" : "STAR",
                    value: particleTexture.id == "STAR" ? textures["CIRCLE"] : textures["STAR"]
                }

            secretMessage = "";
            particles.forEach((p) => {
                p.material = new SpriteMaterial({ map: particleTexture.value });
            })
        }
    }
}

const onDocumentMouseMove = (event: MouseMoveEvent): void => {
    mouseLocation = {
        x: event.clientX - windowVector.x,
        y: event.clientY - windowVector.y,
    }
    pageFade.onMouseMove();
}

const onKeyPress = (event: KeyPressEvent): void => {
    if (secretMessage.length + 1 > 3) {
        secretMessage = "";
    }
    secretMessage = `${secretMessage}${String.fromCharCode(event.keyCode)}`.toUpperCase();
}

let singleton = false
export const mountCanvas = (): void => {
    if (singleton === false) {
        singleton = true;
        const stateCheck = setInterval(() => {
            if (document.readyState === 'complete') {
                clearInterval(stateCheck);
                main();
            }
        }, 100);
    }
}