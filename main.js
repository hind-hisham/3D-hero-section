import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as POSTPROCEEING from 'postprocessing'

const gltfLoader= new GLTFLoader()
// Canvas
const canvas = document.querySelector('#bg')
const scene = new THREE.Scene()
const clock = new THREE.Clock()
var obj;
//the earth obj
gltfLoader.load('scene.gltf', (gltf) => {
    obj=gltf;
    obj.scene.position.x = 0
    obj.scene.position.y = 0
    obj.scene.position.z = 0
    obj.scene.rotation.y = 190
    obj.scene.scale.set(0.3,0.3,0.3)
    scene.add(obj.scene)
})
// Lights
const pointLight2 = new THREE.PointLight(0xffffff ,1)
pointLight2.position.x = 100
pointLight2.position.y = 100
pointLight2.position.z = 100
scene.add(pointLight2)
//Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () =>
{    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
  // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
// Base camera
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 5000)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 35
scene.add(camera)
// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// Materials
let circleGeo =new THREE.CircleGeometry(10,50);
let circleMat =new THREE.MeshBasicMaterial({
    color:'blue'
})
let circle=new THREE.Mesh(circleGeo,circleMat);
circle.position.set(0,0,0)
scene.add(circle)
// postproceeing
let godryEffect = new POSTPROCEEING.GodRaysEffect(camera,circle,{
    resolutionScale:3,
    density:.9,
    decay:.95,
    samples:100
});
let renderPass=new POSTPROCEEING.RenderPass(scene,camera);
let effectPass=new POSTPROCEEING.EffectPass(camera,godryEffect);
effectPass.renderToScreen=true;
const composer =new POSTPROCEEING.EffectComposer(renderer);
composer.addPass(renderPass);
composer.addPass(effectPass);
//Animate
 document.addEventListener('mousemove',onDoc)
 let mouseX=0;
 let mouseY=0;
 let targetx=0;
 let targety=0;
 const windowx= window.innerWidth /2;
 const windowy= window.innerHeight /2;
 function onDoc(event) {
     mouseX= (event.clientX - windowx)
     mouseY=(event.clientY - windowy)
 }
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    targetx= mouseX * .005;
    targety= mouseY * .005;
      if(obj){
        obj.scene.rotation.y = 0.04 * elapsedTime;
        obj.scene.rotation.y += 0.5 * (targetx - obj.scene.rotation.y);
        obj.scene.rotation.x += 0.5 * (targety - obj.scene.rotation.x);
        obj.scene.rotation.z += -0.5 * (targety - obj.scene.rotation.x);
      }
   composer.render(0.1);
   window.requestAnimationFrame(tick)
}
tick()