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
import { floorInfos, lightInfos, monitorInfos } from "../data/info";
import MeshLine from "./meshLine";
import { env } from "echarts/core";

class AddMesh {
  constructor() {
    this.textureLoader = new THREE.TextureLoader();
    this.dracoLoader = new DRACOLoader();
    this.gltfLoader = new GLTFLoader();
    this.dracoLoader.setDecoderPath("./draco/");
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
    this.scene = sceneModule.scene;
    this.addCity();
    this.addSceneBackground();
    this.addLight();
    this.addWeahterPanel();
    this.addPersons();

    this.hour = -1;
    this.randomWeather();
    eventHub.on("getHour", (hour) => {
      this.hour++;
      if (this.hour === 6) {
        this.randomWeather();
      }

      this.hour == 24 && (this.hour = 0);
    });
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
    eventHub.on("togglePersons", () => {
      this.personsTags.forEach((item) => {
        item.visible = !item.visible;
      });
    });
    //线框模型集合
    this.meshLines = [];

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
        this.sphereSky.mesh.material.map=this.dayTexture
        this.scene.background =  this.dayTexture;
        this.scene.environment =  this.dayTexture;
        this.meshLines.forEach((item) => {
          item.visible = false;
        });
        this.lightMeshes.forEach((item) => {
          item.children[2].intensity = 0;
        });
        this.floors.forEach((item) => {
          item.isMesh && (item.material.opacity = 1);
        });
      } else {
        this.sphereSky.mesh.material.map=this.nightTexture
        this.scene.background =  this.nightTexture;
        this.scene.environment =  this.nightTexture;
        this.floors.forEach((item) => {
          item.isMesh && (item.material.opacity = 0.7);
        });
        this.meshLines.forEach((item) => {
          item.visible = true;
        });

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
    this.floors = [];
    //楼栋信息标签
    this.infoTags = [];
    //路灯点光源
    this.lightMeshes = [];
    //路灯标签
    this.lightTags = [];
    //路灯信息标签
    this.lightInfoTags = [];
    //监控信息标签
    this.monitorInfoTags = [];
    //路灯物体集合
    this.rayCasterLights = [];
    //监控信息标签
    this.monitorTags = [];
    //监控物体集合
    this.monitorMeshes = [];
    //人物轨迹集合
    this.wayLines=[]
    //人物信息集合
    this.personInfoObj=[]
    const floorInfoData = floorInfos();
    //路灯信息数据
    const lightInfoData = lightInfos();
    //监控信息数据
    const monitorInfoData = monitorInfos();

    this.gltfLoader.load("./model/smartPark2.glb", (gltf) => {
      console.log(gltf.scene);
      console.log(CameraModule);
      gsap.to(CameraModule.activeCamera.position, {
        x: -400,
        y: 50,
        z: -100,
        duration: 2,
      });
      gltf.scene.traverse((child) => {
        if (child.name.indexOf("栋") != -1) {
          let maxY;
          if (child.isMesh) {
            //计算建筑最高点
            child.geometry.computeBoundingBox();
            maxY = child.geometry.boundingBox.max.y;
            let meshLine = new MeshLine(child.geometry);
            const size = child.scale.x * 1.01;
            meshLine.mesh.scale.set(size, size, size);
            meshLine.mesh.position.copy(child.position);
            meshLine.mesh.rotation.copy(child.rotation);
            this.meshLines.push(meshLine.mesh);
            this.scene.add(meshLine.mesh);
            child.material.transparent = true;
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
          this.floors.push(child);
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
          gsap.to(lightInfo.position,{
            y: maxY + 8,
            duration:3,
            repeat:-1,
            yoyo:true
          })
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
          monitorInfo.position.set(0, maxY+1 , 0);
          gsap.to(monitorInfo.position,{
            y:1.5 ,
            duration:3,
            repeat:-1,
            yoyo:true
          })
          monitorInfo.visible = false;
          child.add(monitorInfo);
          this.monitorTags.push(monitorInfo);
          this.monitorMeshes.push(child.children[1]);
        }
      });
      window.addEventListener(
        "click",
        (event) => {
          this.clearInfoTags();
          let mouse = getMouseXY(event);
          //射线检测
          let getIntersectObjects = rayCaster.getIntersectObjects(mouse, [
            ...this.floors,
            ...this.rayCasterLights,
            ...this.monitorMeshes,
            ...this.lightInfoTags,
          ]);

          if (getIntersectObjects.length > 0) {
            let object = getIntersectObjects[0].object;

            const maxY = object.geometry.boundingBox.max.y;
            composerModule.outlineEffect.selection.set([object]);
            composerModule.bloomEffect.selection.set([object]);

            let floorInfo = floorInfoData[object.name];
            if (floorInfo) {
              //添加楼层信息标签
              const infoDiv = document.createElement("div");
              infoDiv.className = "infoTag";
              infoDiv.innerHTML = `

                <div class="info-item">
                <span class="info-label">租金：</span><span>${floorInfo.rent}</span>         
                </div>
                <div class="info-item">
                <span class="info-label">保安：</span><span>${floorInfo.baoan}</span>
                </div>
                <div class="info-item">
                <span class="info-label">物管：</span><span>${floorInfo.wuguan}</span>
                </div> <div class="info-item">
                <span class="info-label">电话：</span><span>${floorInfo.tel}</span>
                </div>
              
                
                `;
              const floorTag = new CSS2DObject(infoDiv);
              floorTag.position.set(10, maxY + 12, 0);
              this.infoTags.push(floorTag);
              object.add(floorTag);
            }

            let monitorInfo = monitorInfoData[object.name];

            if (monitorInfo) {
              console.log(monitorInfo);
              //添加监控信息标签
              const infoDiv = document.createElement("div");

              infoDiv.className = "infoTag";
              infoDiv.innerHTML = `
                  <div class="info-item">
                  <span class="info-label">设备名称：</span><span>${object.name}</span>         
                  </div>
                  <div class="info-item">
                  <span class="info-label">设备位置：</span><span>${monitorInfo.eqPosition}</span>         
                  </div>
                  <div class="info-item">
                  <span class="info-label">设备功率：</span><span>${monitorInfo.eqPower}</span>
                  </div>
                  <div class="info-item">
                  <span class="info-label">设备状态：</span><span>${monitorInfo.eqState}</span>
                </div>

                  
                  `;

              const monitorTag = new CSS2DObject(infoDiv);
              monitorTag.position.set(0, maxY + 5, 0);
              this.monitorInfoTags.push(monitorTag);
              object.add(monitorTag);
            }
            let lightInfo = lightInfoData[object.name];
            if (lightInfo) {
              //添加楼层信息标签
              const infoDiv = document.createElement("div");

              infoDiv.className = "infoTag";
              infoDiv.innerHTML = `
                  <div class="info-item">
                  <span class="info-label">设备名称：</span><span>${object.name}</span>         
                  </div>
                  <div class="info-item">
                  <span class="info-label">设备位置：</span><span>${lightInfo.eqPosition}</span>         
                  </div>
                  <div class="info-item">
                  <span class="info-label">设备功率：</span><span>${lightInfo.eqPower}</span>
                  </div>
                  <div class="info-item">
                  <span class="info-label">设备状态：</span><span>${lightInfo.eqState}</span>
                </div>

                  
                  `;

              const lightTag = new CSS2DObject(infoDiv);
              lightTag.position.set(10, maxY + 15, 0);
              this.lightInfoTags.push(lightTag);
              object.add(lightTag);
            }
          }
        },
        false
      );

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
        this.dayTexture=texture
        this. sphereSky = new SphereSky(1000, this.dayTexture);
        this.sphereSky.mesh.position.set(-450, 0, 0);

        this.scene.add(this.sphereSky.mesh);
        this.dayTexture.mapping = THREE.EquirectangularReflectionMapping;
        this.scene.background =  this.dayTexture;
        this.scene.environment =  this.dayTexture;
      });
      this.rgbeLoader
      .loadAsync("./textures/hdr/sky_night.hdr")
      .then((texture) => {
        this.nightTexture=texture
 
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

    this.panel.position.set(3, -6, -10);

    CameraModule.activeCamera.add(this.panel);
  }
  clearInfoTags() {
    this.infoTags.forEach((item) => {
      item.removeFromParent();
    });

    this.lightInfoTags.forEach((item) => {
      item.removeFromParent();
    });
    this.monitorInfoTags.forEach((item) => {
      item.removeFromParent();
    });
  }
  addPersons() {
    this.personsTags = [];
    let positions=[]
    for (let i = 0; i < 30; i++) {
      let randomX = Math.random() * (-287 - -638 + 1) + -638;
      let randomZ = Math.random() * (-153 - -429 + 1) + -429;
      let position = new THREE.Vector3(randomX, 0, randomZ);
      positions.push(position)
      const personDiv = document.createElement("div");
      personDiv.className = "personTag";

      window.showPersonWay =  (index)=> {
        let pos=positions[index]
        this.showPersonWay(pos,index)
      };
      window.clearPersonWay =  (index)=> {
        this.clearPersonWay(index)
      };
      let objec2d = new CSS2DObject(personDiv);
      const infoDiv = document.createElement("div");

      infoDiv.className = "infoTag";
      infoDiv.innerHTML = `
          <div class="closeInfo">
            <button onmousedown="window.clearPersonWay(${i})">X</button>
          </div>
          <div class="info-item">
          <span class="info-label">姓名：</span><span>xxx${i}</span>         
          </div>
          <div class="info-item">
          <span class="info-label">电话：</span><span>1234567</span>         
          </div>
          <div class="info-item">
          <span class="info-label">进入事件：</span><span>2022-07-08 08:50:20</span>
          </div>
          <div class="info-item-btn">
          <button type="button" class="confirm-btn" onmousedown=" window.showPersonWay(${i})">查看运动轨迹</button>
        </div>

          
          `;
      let infoObj = new CSS2DObject(infoDiv);
      infoObj.position.set(0, 15, 0);
      objec2d.position.set(position.x, position.y, position.z);
      let delayTime=Math.random()
      gsap.to(objec2d.position,{
        delay:delayTime,
        y:position.y+2,
        duration:3,
        repeat:-1,
        yoyo:true
      })
      objec2d.visible = false;
      objec2d.add(infoObj);
      infoObj.visible = false;
      personDiv.addEventListener(
        "mousedown",
        (event) => {
          infoObj.visible = true;
        },
        false
      );
      this.personInfoObj.push(infoObj)
      this.personsTags.push(objec2d);
      this.scene.add(objec2d);
    }
    console.log(this.personsPosition);
  }
  showPersonWay(position,i) {
    let hasOne=this.wayLines.find((item)=>{
      return item.name===i
    })
    if(hasOne){
      return
    }
    let linePoints=[
      new THREE.Vector3(position.x+Math.random()*(400-(-400)+1)-400,0,position.z+Math.random()*(400-(-400)+1)-400),
      new THREE.Vector3(position.x+Math.random()*(400-(-400)+1)-400,0,position.z+Math.random()*(400-(-400)+1)-400),
      new THREE.Vector3(position.x+Math.random()*(400-(-400)+1)-400,0,position.z+Math.random()*(400-(-400)+1)-400),
      new THREE.Vector3(position.x+Math.random()*(400-(-400)+1)-400,0,position.z+Math.random()*(400-(-400)+1)-400),
      new THREE.Vector3(position.x+Math.random()*(400-(-400)+1)-400,0,position.z+Math.random()*(400-(-400)+1)-400),

      position
    ]
    //创建曲线
    let lineCurve=new THREE.CatmullRomCurve3(linePoints)
    let wayCubeGeometry=new THREE.TubeGeometry(lineCurve,100,0.4,5,false)
    let texture=this.textureLoader.load('./textures/z_11.png')
    texture.repeat.set(10,2)

    texture.wrapS=THREE.RepeatWrapping
    texture.wrapT=THREE.MirroredRepeatWrapping
    let wayLineMaterial=new THREE.MeshBasicMaterial({
      map:texture,
      transparent:true
    })
   let wayLineMesh=new THREE.Mesh(wayCubeGeometry,wayLineMaterial)
    wayLineMesh.position.set(0,10,0)
    gsap.to(texture.offset,{
      x:-5,
      y:-5,
      ease:'none',
      repeat:-1,
      duration:5
    })
    wayLineMesh.name=i
    this.wayLines.push(wayLineMesh)

    this.scene.add(wayLineMesh)


  }
  clearPersonWay(index){

    this.personInfoObj[index].visible=false
    let clearItem=this.wayLines.find((item)=>{
      return item.name==index
    })
    if(clearItem){
      clearItem.geometry.dispose()
      clearItem.material.dispose()
      clearItem.removeFromParent()
    }
        this.wayLines.forEach((item,i)=>{
      if(item.name===index){

        this.wayLines.splice(i,1)
      }
    })
  

  }
}
export default AddMesh;
