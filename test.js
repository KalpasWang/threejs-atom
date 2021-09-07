import * as THREE from 'three'
import './style.css'

let renderer, scene, camera

scene = new THREE.Scene()
scene.fog = new THREE.Fog(0x090b33, 5, 50)

renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enable = true
document.body.appendChild(renderer.domElement)

const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
const material = new THREE.MeshLambertMaterial()
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const light = new THREE.PointLight(0xff0000, 5, 100)
light.position.set(50, 50, 50)
const ambientLight = new THREE.AmbientLight(0xff0000, 0.3)
scene.add(light)
scene.add(ambientLight)

camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.01,
  10
)
camera.position.z = 1
camera.lookAt(scene.position)

function renderTest() {
  mesh.rotation.x += 0.01
  mesh.rotation.y += 0.01
  renderer.render(scene, camera)
  requestAnimationFrame(renderTest)
}
renderTest()
