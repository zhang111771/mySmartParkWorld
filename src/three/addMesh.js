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
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import rayCaster from "./rayCaster";
import { getMouseXY } from "../utils/utils";
import composerModule from "./composerModule";
import { floorInfos } from "../data/info";
import MeshLine from "./meshLine";
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
    //清除楼栋信息
    eventHub.on("clearFloorTags", () => {
      this.clearInfoTags();
    });
    eventHub.on("toggleMonitor", () => {
      this.monitorTags.forEach((item) => {
        item.visible = !item.visible;
      });
    });
    eventHub.on("toggleLight", () => {
      this.lightTags.forEach((item) => {
        item.visible = !item.visible;
      });
    });
    //线框模型集合
    this.meshLines=[]
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
    //控制路灯开关
    eventHub.on("getHour", (hour) => {
      if (Math.abs(hour - 12) <= 6) {


        this.meshLines.forEach((item)=>{
          item.visible=false
        })
        this.lightMeshes.forEach((item) => {
          item.children[2].intensity = 0;
          
        });
      } else {
        this.meshLines.forEach((item)=>{
          item.visible=true
        })
        
        this.lightMeshes.forEach((item) => {
          item.children[2].intensity = 0.7;
          

        });
      }
    });
  }
  addHelper() {
    this.hlper = new THREE.AxesHelper(50);
    this.scene.add(this.hlper);
  }
  addCity() {
    this.actions = [];
    //楼栋
    let floors = [];
    //楼栋信息标签
    this.infoTags = [];
    //路灯点光源
    this.lightMeshes = [];
    //路灯信息标签
    this.lightTags = [];
    //路灯物体集合
    this.rayCasterLights = [];
    //监控信息标签
    this.monitorTags = [];
    //监控物体集合
    this.monitorMeshes = [];
    const floorInfoData = floorInfos();
    this.gltfLoader.load("./model/smartPark2.glb", (gltf) => {
      console.log(gltf.scene);
      gltf.scene.traverse((child) => {
        if (child.name.indexOf("栋") != -1) {
          let maxY;
          if (child.isMesh) {
            //计算建筑最高点
            child.geometry.computeBoundingBox();
            maxY = child.geometry.boundingBox.max.y;
            let meshLine=new MeshLine(child.geometry)
            console.log(this.meshLine)
            const size=child.scale.x*1.01
            meshLine.mesh.scale.set(size,size,size)
            meshLine.mesh.position.copy(child.position)
            meshLine.mesh.rotation.copy(child.rotation)
            this.meshLines.push(meshLine.mesh)
            this.scene.add(meshLine.mesh)
          } else {
            child.children[1].geometry.computeBoundingBox();
            maxY = child.children[1].geometry.boundingBox.max.y;
          }

          //添加楼层标签
          const floorDiv = document.createElement("div");
          floorDiv.className = "css2dlabel";
          floorDiv.innerHTML = child.name;
          const floorLable = new CSS2DObject(floorDiv);
          floorLable.position.set(0, maxY + 5, 0);

          child.add(floorLable);
          floors.push(child);
        }
        if (child.name.indexOf("路灯") != -1) {
          let maxY;
          child.children[0].geometry.computeBoundingBox();
          maxY = child.children[0].geometry.boundingBox.max.y;
          child.children[1].material.emissiveIntensity = 10;
          const pointLight = new THREE.PointLight(0xffffff, 0, 10);

          pointLight.position.set(0, 10, 0);

          child.add(pointLight);
          //添加路灯信息标签
          const lightDiv = document.createElement("div");
          lightDiv.className = "lightTag";
          // lightDiv.innerHTML = child.name;
          const lightInfo = new CSS2DObject(lightDiv);
          lightInfo.position.set(0, maxY + 5, 0);
          lightInfo.visible = false;
          child.add(lightInfo);
          this.lightTags.push(lightInfo);
          //添加到物体集合
          this.lightMeshes.push(child);
          this.rayCasterLights.push(child.children[1]);
        }
        if (child.name.indexOf("监控") != -1) {
          let maxY;
          child.children[0].geometry.computeBoundingBox();
          maxY = child.children[0].geometry.boundingBox.max.y;
          child.children[1].material.emissiveIntensity = 10;

          //添加路灯信息标签
          const monitorDiv = document.createElement("div");
          monitorDiv.className = "monitorTag";
          // monitorDiv.innerHTML = child.name;
          const monitorInfo = new CSS2DObject(monitorDiv);
          monitorInfo.position.set(0, maxY + 5, 0);
          monitorInfo.visible = false;
          child.add(monitorInfo);
          this.monitorTags.push(monitorInfo);
          this.monitorMeshes.push(child.children[1]);
        }
      });
      window.addEventListener("click", (event) => {
        this.clearInfoTags();
        let mouse = getMouseXY(event);
        //射线检测
        let getIntersectObjects = rayCaster.getIntersectObjects(mouse, [
          ...floors,
          ...this.rayCasterLights,
          ...this.monitorMeshes,
        ]);

        if (getIntersectObjects.length > 0) {
          console.log(getIntersectObjects);
          let object = getIntersectObjects[0].object;
          const maxY = object.geometry.boundingBox.max.y;
          composerModule.outlineEffect.selection.set([object]);
          composerModule.bloomEffect.selection.set([object]);

          let info = floorInfoData[object.name];
          if (info) {
            //添加楼层信息标签
            const infoDiv = document.createElement("div");
            infoDiv.className = "infoTag";
            infoDiv.innerHTML = `

                <div class="info-item">
                <span class="info-label">租金：</span><span>${info.rent}</span>         
                </div>
                <div class="info-item">
                <span class="info-label">保安：</span><span>${info.baoan}</span>
                </div>
                <div class="info-item">
                <span class="info-label">物管：</span><span>${info.wuguan}</span>
                </div> <div class="info-item">
                <span class="info-label">电话：</span><span>${info.tel}</span>
                </div>
              
                
                `;
            const floorTag = new CSS2DObject(infoDiv);
            floorTag.position.set(10, maxY + 12, 0);
            this.infoTags.push(floorTag);
            object.add(floorTag);
          }
        }
      });
      //动画
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

    CameraModule.activeCamera.add(this.panel);
  }
  clearInfoTags() {
    this.infoTags.forEach((item) => {
      item.removeFromParent();
    });
  }
}
export default AddMesh;
