import * as THREE from "https://cdn.skypack.dev/three@0.124";

import { OrbitControls } from "./movement.js";

class Planet {
    constructor(url, size) {
        this.url = url;
        this.size = size;
    }
}

const planetImages = {
    'earth': new Planet('Textures/earthUV.jpeg', 3),
    'mercury': new Planet('Textures/2_mercury.jpg', 1.14),
    'venus': new Planet('Textures/2k_venus_surface.jpg', 2.85),
    'moon': new Planet('Textures/2k_moon.jpg', 0.81),
    'mars': new Planet('Textures/2k_mars.jpg', 1.56),
    'jupiter': new Planet('Textures/2k_jupiter.jpg', 6),
    'saturn': new Planet('Textures/2k_saturn.jpg', 5.5),
    'neptune': new Planet('Textures/2k_neptune.jpg', 4.5),
    'uranus': new Planet('Textures/2k_uranus.jpg', 4.3),
    'sun': new Planet('Textures/sunUV.jpg', 7),
    'pluto': new Planet('Textures/plutomap1k.jpg', .5),
};

let camera;
let controls;
let currentPlanet;
let sphere;
let moonGroup;
let shouldAnimate;
let x = null;
let y = null;
let z = null;
var angle = 0;

export function showPlanetView(planet, isFromPlanet) {
    x = null;
    y = null;
    z = null;
    angle = 0;
    shouldAnimate = true;
    currentPlanet = planetImages[planet];
    const scene = new THREE.Scene();
    const background = new THREE.TextureLoader().load('Textures/bg.png');
    scene.background = background;
    camera = new THREE.
        PerspectiveCamera(
            75,
            innerWidth / innerHeight,
            0.1,
            1000
        );

    const renderer = new THREE.WebGLRenderer(

    );
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    const canvas = document.querySelector('canvas');
    if (canvas) {
        canvas.parentNode.removeChild(canvas);
    }
    document.body.appendChild(renderer.domElement);

    sphere = new THREE
        .Mesh(new THREE.SphereGeometry(currentPlanet.size, 50, 50),
            new THREE.MeshBasicMaterial({
                //color: 0xFF0000
                map: new THREE.TextureLoader().load(currentPlanet.url)
            })
        );

    if (planet == "earth") {
        const moonSphereGeometry = new THREE.SphereGeometry(1, 15, 15);
        const moonSphereTexture = new THREE.TextureLoader().load("./Textures/2k_moon.jpg");
        const moonSphereMaterial = new THREE.MeshBasicMaterial({ map: moonSphereTexture });
        const moon = new THREE.Mesh(moonSphereGeometry, moonSphereMaterial);
        moonSphereGeometry.translate(10, 4, 0);
        moonGroup = new THREE.Group();
        moonGroup.add(moon);
        moonGroup.rotation.set(1.01, 0, 0);

        scene.add(moonGroup);
    }

    if (planet == 'saturn') {
        const satRingGeometry = new THREE.TorusGeometry(7.5, 0.8, 2.5, 100);
        const ringTexture = new THREE.TextureLoader().load("./Textures/2k_saturn_ring_alpha.png");
        const ringMaterial = new THREE.MeshBasicMaterial({ map: ringTexture });
        const sRing = new THREE.Mesh(satRingGeometry, ringMaterial);
        sRing.rotation.set(1.4, 0, 0);
        scene.add(sRing);
    }

    scene.add(sphere);
    camera.position.z = isFromPlanet ? 15 : 100;
    controls = new OrbitControls(camera, renderer.domElement);
    function addStar() {
        const geometry = new THREE.SphereGeometry(0.1, 24, 24);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
        const star = new THREE.Mesh(geometry, material);

        const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));
        //if (x < 20 && y < 20 && z < 20) return;
        star.position.set(x, y, z);
        scene.add(star);
    }

    function animate() {
        if (!shouldAnimate) {
            return;
        }
        requestAnimationFrame(animate);
        controls.update();

        sphere.rotation.y += .005;
        if (moonGroup) {
            moonGroup.rotation.y += 0.01;
        }
        renderer.render(scene, camera);


    }

    Array(200).fill().forEach(addStar);
    if (!isFromPlanet) {
        for (let i = 0; i < 175; i++) {
            setTimeout(() => camera.position.z -= .5, 5 * i + i);
        }
    }
    animate();
}


export function changeCamera() {
    // camera.position.x = radius * Math.cos( angle );  
    // camera.position.z = radius * Math.sin( angle );
    // camera.position.z = radius * Math.sin( angle );
    controls.target.set(angle, angle, angle);

    angle += 1;
}


function slightZoom(posVal) {
    if (posVal > 0) {
        return (posVal - currentPlanet.size) / 30;
    } else {
        return (posVal + currentPlanet.size) / 30;
    }
}

export function goToPlanet() {
    if (Math.abs(camera.position.x))
        if (x === null) {
            x = slightZoom(camera.position.x);
        }
    if (y === null) {
        y = slightZoom(camera.position.y);
    }
    if (z === null) {
        z = slightZoom(camera.position.z);
    }
    camera.position.x -= x;
    camera.position.y -= y;
    camera.position.z -= z;
}

export function stopPlanetView() {
    shouldAnimate = false;
}