import p5 from 'p5'
import * as THREE from 'three'
import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';


let p5s=new Array();

let checkBoxChecked=false;



// CAMERA
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 150);
camera.position.set(0, 20, 40);
//camera.position.set(0,10,0);
//camera.rotation.set(Math.PI,Math.PI,Math.PI);
camera.lookAt(new THREE.Vector3(0,0, 0));

// RENDERER
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// WINDOW RESIZE HANDLING
export function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

// SCENE
const scene: THREE.Scene = new THREE.Scene()
scene.background = new THREE.Color(0xbfd1e5);

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
/*
camera.position.set(-35, 70, 100);
camera.position.set(0,10,0);
camera.rotation.set(0,0,0);
*/
//controls.target=new Vector3(0,0,0);
//controls.update();
controls.minZoom=1;
controls.maxZoom=1;
//controls.minAzimuthAngle = 0
//controls.maxAzimuthAngle = Math.PI / 2
controls.minPolarAngle = Math.PI/6
controls.maxPolarAngle = 3*Math.PI/6
controls.maxDistance = 40
controls.minDistance = 2

export function handleCheckbox(event){
  console.log(event);
  
}

export function animate() {
  let lastCheck=checkBoxChecked;
  var element = <HTMLInputElement> document.getElementById("checkbox");
  if (element) {
    checkBoxChecked=element.checked
  }
  if (lastCheck!=checkBoxChecked) {
    loadData();
  }


  dragObject();
  for (var i = 0; i < p5s.length; i++){
    p5s[i].needsUpdate = true;
  }
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

// ambient light
let hemiLight = new THREE.AmbientLight(0xffffff, 0.20);
scene.add(hemiLight);

//Add directional light
let dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(-30, 50, -30);
scene.add(dirLight);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.left = -70;
dirLight.shadow.camera.right = 70;
dirLight.shadow.camera.top = 70;
dirLight.shadow.camera.bottom = -70;

var newcolor=80;

const s = function( sketch ) {

    let w = 200;
    let h = 50;
    let p5_canvas;
    let displayName=""
    let displayUser=""

    sketch.setup = () => {
      p5_canvas=sketch.createCanvas(w, h,p5.WEBGL);
      sketch.background(40);
      //p5_canvas.style('display', 'none');// hide this because I want to use in three.js
    };

    sketch.setText= (aName,aUser) => {
      displayName=aName;
      displayUser=aUser;
    }

    sketch.getP5Canvas = function(){
      if (p5_canvas) {
          return p5_canvas.elt;
      } else {
        return null;
      }
    }
  
    sketch.draw = () => {
      sketch.fill(50);
      sketch.rect(0,0,w,h)
      sketch.fill(200);
      sketch.rect(2,2,w-4,h-4);
      sketch.fill(0);
      sketch.text(displayName,30,15);
      sketch.text(displayUser,30,35);
    };
};

function createFloor() {
  let pos = { x: 0, y: -10, z: 0 };
  let scale = { x: 100, y: 2, z: 100 };

  let blockPlane = new THREE.Mesh(new THREE.BoxBufferGeometry(),
       new THREE.MeshPhongMaterial({ color: 0xf9c834 }));
  blockPlane.position.set(pos.x, pos.y, pos.z);
  blockPlane.scale.set(scale.x, scale.y, scale.z);
  blockPlane.castShadow = true;
  blockPlane.receiveShadow = true;
  scene.add(blockPlane);

  blockPlane.userData.ground = true
}



let panelLayout= [
  { x: -34, y: 10, z: -50, rx:Math.PI/2,ry:0,rz:0 },
  { x: -12, y: 10, z: -50, rx:Math.PI/2,ry:0,rz:0 },
  { x: 10, y: 10, z: -50, rx:Math.PI/2,ry:0,rz:0 },
  { x: 32, y: 10, z: -50, rx:Math.PI/2,ry:0,rz:0 },
  { x: 50, y: 10, z: -34, rx:Math.PI/2,ry:0,rz:Math.PI/2 },
  { x: 50, y: 10, z: -12, rx:Math.PI/2,ry:0,rz:Math.PI/2 },
  { x: 50, y: 10, z: 10, rx:Math.PI/2,ry:0,rz:Math.PI/2 },
  { x: 50, y: 10, z: 32, rx:Math.PI/2,ry:0,rz:Math.PI/2 },
  { x: 32, y: 10, z: 50, rx:Math.PI/2,ry:0,rz:Math.PI },
  { x: 10, y: 10, z: 50, rx:Math.PI/2,ry:0,rz:Math.PI },
  { x: -12, y: 10, z: 50, rx:Math.PI/2,ry:0,rz:Math.PI },
  { x: -34, y: 10, z: 50, rx:Math.PI/2,ry:0,rz:Math.PI },
  { x: -50, y: 10, z: 32, rx:Math.PI/2,ry:0,rz:Math.PI*3/2 },
  { x: -50, y: 10, z: 10, rx:Math.PI/2,ry:0,rz:Math.PI*3/2 },
  { x: -50, y: 10, z: -12, rx:Math.PI/2,ry:0,rz:Math.PI*3/2 },
  { x: -50, y: 10, z: -34, rx:Math.PI/2,ry:0,rz:Math.PI*3/2}
]

function createPanel(i,imgUrl) {
  let scale = { x: 20, y: 0.25, z: 20 }
  let pos = panelLayout[i];

  let panelTexture = new THREE.TextureLoader().load(imgUrl);
  let panelMaterial= new THREE.MeshBasicMaterial({ map: panelTexture, transparent: false, opacity: 0, side: THREE.DoubleSide });
  let box = new THREE.Mesh(new THREE.BoxBufferGeometry(), panelMaterial);
  box.position.set(pos.x, pos.y, pos.z);
  box.scale.set(scale.x, scale.y, scale.z);
  box.rotation.set(pos.rx,pos.ry,pos.rz);
  box.castShadow = false;
  box.receiveShadow = false;
  scene.add(box)
  box.userData.draggable = false
  box.userData.name = 'PANEL'
}
    

function createP5TextPanel(cnt,aName,aUser) {
  let scale = { x: 20, y: 0.25, z: 5 }
  let pos = panelLayout[cnt]

  let sketchInstance = new p5(s);
  sketchInstance.setup();
  sketchInstance.setText(aName,aUser);
  let p5c=sketchInstance.getP5Canvas();
  console.log(p5c);
  let p5Texture = new THREE.Texture(p5c); 
  let p5Material= new THREE.MeshBasicMaterial({ map: p5Texture, transparent: false, opacity: 0, side: THREE.DoubleSide });

  let box = new THREE.Mesh(new THREE.BoxBufferGeometry(), p5Material);
    //  new THREE.MeshPhongMaterial({ color: 0x33FFFF }));
  box.position.set(pos.x, pos.y-13, pos.z);

  box.scale.set(scale.x, scale.y, scale.z);
  box.rotation.set(pos.rx,pos.ry,pos.rz);
  box.castShadow = false;
  box.receiveShadow = false;

  p5s.push(p5Texture);

  scene.add(box)

  box.userData.draggable = false
  box.userData.name = 'PANEL'

}

function createCard(x,z) {
  let scale = { x: 6, y: 0.25, z: 6 }
  let pos = { x: x, y: scale.y / 2, z: z }

  let box = new THREE.Mesh(new THREE.BoxBufferGeometry(), 
      new THREE.MeshPhongMaterial({ color: 0xFFFFFF }));
  box.position.set(pos.x, pos.y, pos.z);
  box.scale.set(scale.x, scale.y, scale.z);
  box.castShadow = true;
  box.receiveShadow = true;
  scene.add(box)

  box.userData.draggable = false
  box.userData.name = 'CARD'
}
const raycaster = new THREE.Raycaster(); // create once
const clickMouse = new THREE.Vector2();  // create once
const moveMouse = new THREE.Vector2();   // create once
var draggable: THREE.Object3D;

function intersect(pos: THREE.Vector2) {
  raycaster.setFromCamera(pos, camera);
  return raycaster.intersectObjects(scene.children);
}

window.addEventListener('click', event => {
  if (draggable != null) {
    console.log(`dropping draggable ${draggable.userData.name}  x,y ${draggable.position.x},${draggable.position.y}`)
    draggable = null as any
    return;
  }

  // THREE RAYCASTER
  clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const found = intersect(clickMouse);
  if (found.length > 0) {
    if (found[0].object.userData.draggable) {
      draggable = found[0].object
      console.log(`found draggable ${draggable.userData.name}`)
    } else if (found[0].object.userData.name == "DECK") {
      getNewCard();
    }
  }
})

window.addEventListener('mousemove', event => {
  moveMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  moveMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

function dragObject() {
  if (draggable != null) {
    const found = intersect(moveMouse);
    if (found.length > 0) {
      for (let i = 0; i < found.length; i++) {
        if (!found[i].object.userData.ground)
          continue
        
        let target = found[i].point;
        draggable.position.x = target.x
        draggable.position.z = target.z
      }
    }
  }
}

function getNewCard() {
}

//let loader;
function loadData() {
  let localurl="assets.json"
  let neturl="https://testnets-api.opensea.io/api/v1/assets?offset=0&limit=200"
  let aUrl=localurl;

  var element = <HTMLInputElement> document.getElementById("checkbox");
  if (element) {
    if (element.checked) {
      aUrl=neturl;
    }
  }

  fetch(aUrl).then(response => response.json()).then(data => {
    //console.log(data);
    let i=0;
    let cnt=0;
    let max=data.assets.length
    console.log("max"+max);
    let lasturl="";
    while ((cnt < 16) && (i < max)) {
      let aName=""
      let aUser=""
      if (data.assets[i].image_preview_url!=null) {
        if (lasturl!=data.assets[i].image_preview_url) {
          lasturl=data.assets[i].image_preview_url;
          if (data.assets[i].name) {
            aName=data.assets[i].name
          }
          if (data.assets[i].user) {
            if (data.assets[i].user.username) {
              aUser=data.assets[i].user.username
            }
          }
          createPanel(cnt,lasturl);
          createP5TextPanel(cnt,aName,aUser);
          cnt++;
        }
      } else if (data.assets[i].image_url!=null) {
        if (lasturl!=data.assets[i].image_url) {
          lasturl=data.assets[i].image_url;
          if (data.assets[i].name) {
            aName=data.assets[i].name
          }
          if (data.assets[i].user) {
            if (data.assets[i].user.username) {
              aUser=data.assets[i].user.username
            }
          }
          createPanel(cnt,lasturl);
          createP5TextPanel(cnt,aName,aUser);
          cnt++;        
        }
      }
      i++;
    }
  });
}

createFloor()
loadData();
//createP5TextPanel(0,"Hey There","test");

animate()
