<template>
  <div
    class="ball-three-js-container"
    :style="ballThreeJsStyle"
    @mousemove="mouseMoveHandlerPublicPage"
    @mouseleave="mouseLeaveHandlerPublicPage"
    @touchmove="touchmoveHandlerPublicPage"
    @touchend="touchendHandlerPublicPage">
    
    <canvas class="ball-three-js" ref="canvasRef"  />
  </div>
</template>
<script setup lang="ts">
import interact from 'interactjs'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import useAdminPage from '~/J/useAdminPage'
import useMapper from '~/J/useMapper'
import useMouseActionDetector from '~/J/useMouseActionDetector'
import usePieces from '~/J/usePieces'
import { LEFT_OFFSET, TOP_OFFSET } from '~/appSetup'

const {
  mouseMoveHandlerPublicPage,
    mouseLeaveHandlerPublicPage,
    touchmoveHandlerPublicPage,
    touchendHandlerPublicPage,
} = useMouseActionDetector()

const canvasRef = ref<HTMLCanvasElement>()
const ballThreeJs = ref({
  x: 4500,
  y: 5900
})

const ballThreeJsStyle = computed(() => {
  return {
    left: `${ballThreeJs.value.x + LEFT_OFFSET}px`,
    top: `${ballThreeJs.value.y + TOP_OFFSET}px`,
  }
})

onMounted(() => {
  const { isOnAdminPage } = useAdminPage()
  const { mapperEventData } = useMapper()
  const { zIndexOfLastSelectedPiece, edgePositions } = usePieces()

  if (!canvasRef.value) return
  interact(canvasRef.value).draggable({
    inertia: true,
    autoScroll: true,
    listeners: {
      move(event) {
        if (!isOnAdminPage.value) return
        const scale = mapperEventData.value.scale

        console.log('ballThreeJs.value: ', ballThreeJs.value);
        const xRaw = ballThreeJs.value.x + event.dx / scale
        const yRaw = ballThreeJs.value.y + event.dy / scale
        const x = xRaw > -2000 ? xRaw : -2000
        const y = yRaw > -2000 ? yRaw : -2000
        ballThreeJs.value.x = x
        ballThreeJs.value.y = y
        edgePositions.value.x = Math.max(edgePositions.value.x, x + 2300)
        edgePositions.value.y = Math.max(edgePositions.value.y, y + 2000)
      }
    }
  })


  // Setup BallThreeJs

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  const renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true
  })

  renderer.setPixelRatio(window.devicePixelRatio)
  if (window.innerWidth > 600) {
    renderer.setSize(500, 500)
  } else {
    renderer.setSize(320, 320)
  }
  camera.position.setZ(10)
  camera.position.setX(-3)

  renderer.render(scene, camera)

  // Cube

  // const cubeTexture = new THREE.TextureLoader().load('cubeTest.jpg');
  // const cube = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: cubeTexture }));
  // cube.rotation.x += 0;
  // cube.rotation.y += 0;
  // cube.rotation.z += 0;

  // scene.add(cube);

  // sphere

  const sphereTexture = new THREE.TextureLoader().load('sphereTest2.jpg')

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 75, 75),
    new THREE.MeshStandardMaterial({
      map: sphereTexture
    })
  )

  scene.add(sphere)

  // Lights

  const pointLight = new THREE.PointLight(0xffffff)
  pointLight.position.set(1, 10, 10)

  const ambientLight = new THREE.AmbientLight(0xffffff)
  scene.add(pointLight, ambientLight)

  // Helpers

  // const lightHelper = new THREE.PointLightHelper(pointLight)
  // const gridHelper = new THREE.GridHelper(100, 20);
  // scene.add(lightHelper)
  const controls = new OrbitControls(camera, renderer.domElement)

  // Animation Loop

  function animate() {
    requestAnimationFrame(animate)

    renderer.render(scene, camera)
  }

  animate()
})
</script>

<style lang="stylus" scoped>
.ball-three-js
  position absolute
  bottom 0
  margin-bottom 10rem

.ball-three-js-container
  position absolute


.dark-mode .ball-three-js
  filter invert(1)
  color red
</style>
