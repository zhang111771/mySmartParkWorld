import * as THREE from "three";
import sceneModule from "./sceneModule";
import ControlsModule from "./ControlsModule";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import animate from "./animate";
import SphereSky from "./sphereSky";
import CameraModule from "./CameraModule";
import rainVertex from "../shader/rainVertex.glsl";
import rainFragment from "../shader/rainFragment.glsl";
import sunFragment from "../shader/sunFragment.glsl";
import snowFragment from "../shader/snowFragment.glsl";
import fogFragment from "../shader/fogFragment.glsl";
import eventHub from "@/utils/eventHub";
import gsap from "gsap";
import {CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer'
import rayCaster from "./rayCaster";
import {getMouseXY} from '../utils/utils'
class AddMesh {
  constructor() {
    this.textureLoader = new THREE.TextureLoader();
    this.dracoLoader = new DRACOLoader();
    this.gltfLoader = new GLTFLoader();
    this.dracoLoader.setDecoderPath("./draco/");
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
    this.scene = sceneModule.scene;
    this.addHelper();
    this.addCity();
    this.addSceneBackground();
    this.addLight();
    this.addWeahterPanel();

    let timeout = setTimeout(() => {
      this.randomWeather();
      let interval = setInterval(() => {
        this.randomWeather();
      }, 24000);
    }, 6000);
  }
  randomWeather() {
    const weatherArr = ["晴天", "雨天", "下雪", "有雾"];
    const random = parseInt(Math.random() * 4);

    const weather = weatherArr[random];
    switch (weather) {
      case "晴天":
        this.panel.material = this.sunMaterial;
        break;
      case "雨天":
        this.panel.material = this.rainMaterial;
        
        break;
      case "下雪":
        this.panel.material = this.snowMaterial;
        break;
      case "有雾":
        this.panel.material = this.fogMaterial;
        break;
    }
    this.panel.material.uniforms.iChannel0.value.wrapS =
    this.panel.material.uniforms.iChannel0.value.wrapT = THREE.RepeatWrapping;
  this.panel.material.uniforms.iChannel1.value.wrapS =
    this.panel.material.uniforms.iChannel1.value.wrapT = THREE.RepeatWrapping;
    eventHub.emit("getWeahter", weather);
  }
  addHelper() {
    this.hlper = new THREE.AxesHelper(50);
    this.scene.add(this.hlper);
  }
  addCity() {
    this.actions = [];
    let floors=[]
    this.gltfLoader.load("./model/smartPark2.glb", (gltf) => {
      gltf.scene.traverse((child)=>{
        if(child.isMesh){
          //计算建筑最高点
          child.geometry.computeBoundingBox()
          const maxY=child.geometry.boundingBox.max.y
          if(child.name.indexOf('栋')!=-1){
            
           //添加楼层标签
            const floorDiv=document.createElement('div')
            floorDiv.className='label'
            floorDiv.innerHTML=child.name
            const floorLable=new CSS2DObject(floorDiv)
            floorLable.position.set(0,maxY+5,0);
            child.add(floorLable)
            floors.push(child)
            
          }
        }
      
      })
      window.addEventListener('click',(event)=>{
        let mouse=getMouseXY(event)
        console.log(floors)
        let getIntersectObjects=rayCaster.getIntersectObjects(mouse,floors)
        console.log(getIntersectObjects[0])
      })
      this.cityAnimations = gltf.animations;

      this.mixer = new THREE.AnimationMixer(gltf.scene);
      for (let i = 0; i < this.cityAnimations.length; i++) {
        const asction = this.mixer.clipAction(this.cityAnimations[i]);
        asction.loop = THREE.LoopRepeat;
        this.actions.push(asction);
      }
      this.actions.forEach((item) => {
        item.play();
      });
      animate.addAnimate(({ elapsedTime, deltaTime }) => {
        this.mixer.update(deltaTime + 0.01);
        this.panel.material.uniforms.iTime.value = elapsedTime;
      });
      this.park = gltf.scene;
      this.scene.add(this.park);
    });
  }
  addSceneBackground() {
    this.rgbeLoader = new RGBELoader();
    this.rgbeLoader
      .loadAsync("./textures/hdr/cloud_sky.hdr")
      .then((texture) => {
        const sphereSky = new SphereSky(1000, texture);
        sphereSky.mesh.add(new THREE.AxesHelper(100));
        sphereSky.mesh.position.set(-450, 0, 0);

        this.scene.add(sphereSky.mesh);
        texture.mapping = THREE.EquirectangularReflectionMapping;
        this.scene.background = texture;
        this.scene.environment = texture;
      });
  }
  addLight() {
    this.directionalLight = new THREE.DirectionalLight(
      (0xfffffff).toExponential,
      0.5
    );
    this.directionalLight.position.set(100, 20, 50);
    this.directionalLight.castShadow = true;

    // this.scene.add(this.directionalLight)
  }
  addWeahterPanel() {
    let mouse = new THREE.Vector2();
    window.addEventListener("mousemove", (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = 1 - (event.clientY / window.innerHeight) * 2;
    });
    const texture = this.textureLoader.load("./textures/rain.png");
    const panelGeometry = new THREE.PlaneGeometry(6, 3);
    //雨天shader
    this.rainMaterial = new THREE.ShaderMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      vertexShader: rainVertex,
      fragmentShader: rainFragment,
      uniforms: {
        iResolution: {
          value: new THREE.Vector2(1000, 1000),
        },
        iTime: {
          value: 0,
        },
        uTexture: {
          value: texture,
        },
        iMouse: {
          value: mouse,
        },
        iChannel0: {
          value: this.textureLoader.load("./textures/iChannel0.jpg"),
        },
        iChannel1: {
          value: this.textureLoader.load("./textures/iChannel3.jpg"),
        },
      },
    });
    //太阳shader
    this.sunMaterial = new THREE.ShaderMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      vertexShader: rainVertex,
      fragmentShader: sunFragment,
      uniforms: {
        iResolution: {
          value: new THREE.Vector2(1000, 1000),
        },
        iTime: {
          value: 0,
        },
        uTexture: {
          value: texture,
        },
        iMouse: {
          value: mouse,
        },
        iChannel0: {
          value: this.textureLoader.load("./textures/iChannel0.jpg"),
        },
        iChannel1: {
          value: this.textureLoader.load("./textures/iChannel3.jpg"),
        },
      },
    });
    //雪shader
    this.snowMaterial = new THREE.ShaderMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      vertexShader: rainVertex,
      fragmentShader: snowFragment,
      uniforms: {
        iResolution: {
          value: new THREE.Vector2(1000, 1000),
        },
        iTime: {
          value: 0,
        },
        uTexture: {
          value: texture,
        },
        iMouse: {
          value: mouse,
        },
        iChannel0: {
          value: this.textureLoader.load("./textures/iChannel0.jpg"),
        },
        iChannel1: {
          value: this.textureLoader.load("./textures/iChannel3.jpg"),
        },
      },
    });
    //雾shader
    this.fogMaterial = new THREE.ShaderMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      vertexShader: rainVertex,
      fragmentShader: fogFragment,
      uniforms: {
        iResolution: {
          value: new THREE.Vector2(0.5, 0.1),
        },
        iTime: {
          value: 0,
        },
        uTexture: {
          value: texture,
        },
        iMouse: {
          value: mouse,
        },
        iChannel0: {
          value: this.textureLoader.load("./textures/iChannel3.jpg"),
        },
        iChannel1: {
          value: this.textureLoader.load("./textures/iChannel3.jpg"),
        },
      },
    });

    this.panel = new THREE.Mesh(panelGeometry, this.sunMaterial);
  

    this.panel.position.set(5, -6, -10);

    CameraModule.activeCamera.add(this.panel)
    console.log(CameraModule.activeCamera);
  }
}
export default AddMesh;
