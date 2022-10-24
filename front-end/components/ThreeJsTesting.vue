
<template>
  <canvas id="bg"></canvas>
</template>
<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


onMounted(() => {
  // Setup
  
  const scene = new THREE.Scene();
  
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg') as HTMLCanvasElement,
    alpha: true,
  });
  
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(500, 500);
  camera.position.setZ(10);
  camera.position.setX(-3);
  
  renderer.render(scene, camera);

  // Cube
  
  // const cubeTexture = new THREE.TextureLoader().load('cubeTest.jpg');
  
  // const cube = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: cubeTexture }));
  // cube.rotation.x += 0;
  // cube.rotation.y += 0;
  // cube.rotation.z += 0;
  
  // scene.add(cube);


  // sphere

  const sphereTexture = new THREE.TextureLoader().load('sphereTest2.jpg');
  // const normalTexture = new THREE.TextureLoader().load('normal.jpg');

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.8, 75, 30),
    new THREE.MeshStandardMaterial({
      map: sphereTexture,
      // normalMap: normalTexture,
    })
  );

  scene.add(sphere);

  // sphere.position.z = -2;
  // sphere.position.y = 3;
  // sphere.position.x = 3;
  // sphere.position.setX(2);

  // Lights

  const pointLight = new THREE.PointLight(0xffffff);
  pointLight.position.set(1, 10, 10);

  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(pointLight, ambientLight);

  // Helpers

  // const lightHelper = new THREE.PointLightHelper(pointLight)
  const gridHelper = new THREE.GridHelper(100, 20);
  // scene.add(lightHelper)

  const controls = new OrbitControls(camera, renderer.domElement);


  // Animation Loop

function animate() {
  requestAnimationFrame(animate);

  // cube.rotation.x += 0.001;
  // cube.rotation.y += 0.001;
  // torus.rotation.x += 0.01;
  // torus.rotation.y += 0.005;
  // torus.rotation.z += 0.01;

  // moon.rotation.x += 0.005;

  // controls.update();

  renderer.render(scene, camera);
}

animate();
})
</script>