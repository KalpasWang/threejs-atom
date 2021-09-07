import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import './style.css'

let renderer, scene, camera
let cameraControl
let nucleusGroup
let electron1, electron2, electron3
const PI = Math.PI
const TWO_PI = PI * 2

function generateBall(r, color, name, x, y, z) {
  const sphereGeometry = new THREE.SphereGeometry(r, 32, 32)
  const sphereMaterial = new THREE.MeshLambertMaterial({
    color: color,
  })
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphere.name = name
  sphere.position.set(x || 0, y || 0, z || 0)
  nucleusGroup.add(sphere)
  return sphere
}

function generateElectron(options) {
  const defaultOptions = {
    orbitRadius: 10,
    speed: 0.05,
    angle: Math.random() * TWO_PI,
    radius: 0.2,
    name: 'electron',
    color: 'white',
  }
  const el = Object.assign(defaultOptions, options)
  el.ball = generateBall(el.radius, el.color, el.name)
  return el
}

function init() {
  scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x090b33, 5, 50)

  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enable = true
  document.body.appendChild(renderer.domElement)

  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  )
  camera.position.set(16, 10, 12)
  camera.lookAt(scene.position)

  // 因為原子核有多顆球體，所以需要建立一個原子核的集合物件
  nucleusGroup = new THREE.Object3D()
  scene.add(nucleusGroup)

  // 產生原子核
  const radius = 2
  const stepSize = TWO_PI / 8
  let isRedBall = true
  // 從最上面的球一層一層往下畫
  for (let angleV = 0; angleV <= PI; angleV += stepSize) {
    // 如果是第一層或最後一層，只需要產生一顆球
    if (angleV === 0 || angleV === PI) {
      const ballColor = isRedBall ? 'red' : '#2e30d1'
      generateBall(0.9, ballColor, 'atom', 0, radius * Math.cos(angleV), 0)
      continue
    }
    // 其餘層一律產生8顆球
    for (let angleH = 0; angleH < TWO_PI; angleH += stepSize) {
      let layerRadius = Math.sin(angleV) * radius
      let ballColor = isRedBall ? 'red' : '#2e30d1'
      generateBall(
        0.9,
        ballColor,
        'atom',
        layerRadius * Math.cos(angleH),
        radius * Math.cos(angleV),
        layerRadius * Math.sin(angleH)
      )
      isRedBall = !isRedBall
    }
    isRedBall = !isRedBall
  }

  // 產生圍繞原子核的電子
  electron1 = generateElectron({
    name: 'electron1',
  })
  electron2 = generateElectron({
    name: 'electron2',
  })
  electron3 = generateElectron({
    name: 'electron3',
  })

  // 加入環境光
  const ambientLight = new THREE.AmbientLight('#333')
  scene.add(ambientLight)

  // 加入平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
  scene.add(directionalLight)

  // 加入聚光燈
  const spotLight = new THREE.SpotLight({ color: '#fff' })
  spotLight.position.set(-20, 20, 10)
  spotLight.CastShadow = true
  scene.add(spotLight)

  // 加入 cameraControl 功能
  cameraControl = new OrbitControls(camera, renderer.domElement)
}

function render() {
  renderer.render(scene, camera)
  cameraControl.update()

  // 設定 electron1 繞著 xy 平面轉
  electron1.ball.position.x = electron1.orbitRadius * Math.cos(electron1.angle)
  electron1.ball.position.y = electron1.orbitRadius * Math.sin(electron1.angle)
  electron1.angle += electron1.speed

  // 設定 electron2 繞著 xz 平面轉
  electron2.ball.position.x = electron2.orbitRadius * Math.cos(electron2.angle)
  electron2.ball.position.z = electron2.orbitRadius * Math.sin(electron2.angle)
  electron2.angle += electron2.speed

  // 設定 electron3 繞著 yz 平面轉
  electron3.ball.position.y = electron3.orbitRadius * Math.cos(electron3.angle)
  electron3.ball.position.z = electron3.orbitRadius * Math.sin(electron3.angle)
  electron3.angle += electron3.speed

  // 原子核也做轉動
  nucleusGroup.rotation.y += 0.002

  requestAnimationFrame(render)
}

init()
render()

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
