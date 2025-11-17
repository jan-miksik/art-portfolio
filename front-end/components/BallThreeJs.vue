<template>
  <div
    v-if="!isSmallScreen"
    class="ball-three-js-container"
    :style="ballThreeJsStyle"
    @mousemove.stop="mouseMoveHandlerPublicPage"
    @mouseleave.stop="mouseLeaveHandlerPublicPage"
    @touchmove.stop="touchmoveHandlerPublicPage"
    @touchend.stop="touchendHandlerPublicPage">
    
    <canvas class="ball-three-js" ref="canvasRef"  />
  </div>
</template>
<script setup lang="ts">
import interact from 'interactjs'
import * as THREE from 'three'
import isSmallScreen from '~/J/isMobile'
import useAdminPage from '~/J/useAdminPage'
import useMapper from '~/J/useMapper'
import useMouseActionDetector from '~/J/useMouseActionDetector'
import usePieces from '~/J/usePieces'
import { LEFT_OFFSET, TOP_OFFSET } from '~/constants/layout'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Position constants
const INITIAL_BALL_X = 7500
const INITIAL_BALL_Y = 5700
const MIN_POSITION_BOUND = -2000
const EDGE_POSITION_OFFSET_X = 2300
const EDGE_POSITION_OFFSET_Y = 2000

// Three.js camera constants
const CAMERA_FOV = 50
const CAMERA_NEAR = 0.1
const CAMERA_FAR = 1000
const CAMERA_Z_POSITION = 10
const CAMERA_X_POSITION = -3

// Renderer size constants
const DESKTOP_SCREEN_WIDTH_THRESHOLD = 600
const DESKTOP_RENDERER_SIZE = 500
const MOBILE_RENDERER_SIZE = 320

// Sphere geometry constants
const SPHERE_RADIUS = 1.5
const SPHERE_WIDTH_SEGMENTS = 75
const SPHERE_HEIGHT_SEGMENTS = 75

// Light constants
const POINT_LIGHT_COLOR = 0xffffff
const POINT_LIGHT_X = 1
const POINT_LIGHT_Y = 10
const POINT_LIGHT_Z = 10
const AMBIENT_LIGHT_COLOR = 0xffffff

const {
  mouseMoveHandlerPublicPage,
    mouseLeaveHandlerPublicPage,
    touchmoveHandlerPublicPage,
    touchendHandlerPublicPage,
} = useMouseActionDetector()

const canvasRef = ref<HTMLCanvasElement>()
const ballThreeJs = ref({
  x: INITIAL_BALL_X,
  y: INITIAL_BALL_Y
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

        const xRaw = ballThreeJs.value.x + event.dx / scale
        const yRaw = ballThreeJs.value.y + event.dy / scale
        const x = xRaw > MIN_POSITION_BOUND ? xRaw : MIN_POSITION_BOUND
        const y = yRaw > MIN_POSITION_BOUND ? yRaw : MIN_POSITION_BOUND
        ballThreeJs.value.x = x
        ballThreeJs.value.y = y
        edgePositions.value.x = Math.max(edgePositions.value.x, x + EDGE_POSITION_OFFSET_X)
        edgePositions.value.y = Math.max(edgePositions.value.y, y + EDGE_POSITION_OFFSET_Y)
      }
    }
  })


  // Setup BallThreeJs
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    CAMERA_FOV,
    window.innerWidth / window.innerHeight,
    CAMERA_NEAR,
    CAMERA_FAR
  )

  const renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true
  })

  renderer.setPixelRatio(window.devicePixelRatio)
  if (window.innerWidth > DESKTOP_SCREEN_WIDTH_THRESHOLD) {
    renderer.setSize(DESKTOP_RENDERER_SIZE, DESKTOP_RENDERER_SIZE)
  } else {
    renderer.setSize(MOBILE_RENDERER_SIZE, MOBILE_RENDERER_SIZE)
  }
  camera.position.setZ(CAMERA_Z_POSITION)
  camera.position.setX(CAMERA_X_POSITION)
  renderer.render(scene, camera)

  // Sphere
  const sphereTexture = new THREE.TextureLoader().load('sphereTest2.jpg')
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(SPHERE_RADIUS, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS),
    new THREE.MeshStandardMaterial({
      map: sphereTexture
    })
  )
  scene.add(sphere)

  // Lights
  const pointLight = new THREE.PointLight(POINT_LIGHT_COLOR)
  pointLight.position.set(POINT_LIGHT_X, POINT_LIGHT_Y, POINT_LIGHT_Z)
  const ambientLight = new THREE.AmbientLight(AMBIENT_LIGHT_COLOR)
  scene.add(pointLight, ambientLight)

  // Orbit controls
  new OrbitControls(camera, renderer.domElement)

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
