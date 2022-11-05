import * as THREE from "https://cdn.skypack.dev/three@0.124";

let scene, camera, renderer, starGeo, star, stars;
let shouldAnimate;
export function slipspace() {
  shouldAnimate = true;
  scene = new THREE.Scene();
  const background = new THREE.TextureLoader().load(
    "Textures/bg.png"
  );
  scene.background = background;

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = 1;
  camera.rotation.x = Math.PI / 2;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  const canvas = document.querySelector("canvas");
  if (canvas) {
    canvas.parentNode.removeChild(canvas);
  }
  document.body.appendChild(renderer.domElement);

  starGeo = new THREE.Geometry();
  for (let i = 0; i < 6000; i++) {
    star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    star.velocity = 6;
    star.acceleration = 0.6;
    starGeo.vertices.push(star);
  }
  let sprite = new THREE.TextureLoader().load("./Textures/star.png");


  let starMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.5,
    map: sprite,
  });

  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);
  animate();
}

function animate() {
  if (!shouldAnimate) {
    return;
  }
  starGeo.vertices.forEach((p) => {
    p.velocity += p.acceleration;
    p.y -= p.velocity;
    if (p.y < -200) {
      p.y = 200;
      p.velocity = 0;
    }
  });
  starGeo.verticesNeedUpdate = true;
  stars.rotation.y += 0.002;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

export function stopSlipspace() {
  shouldAnimate = false;
}
