import * as THREE from "three";
import gsap from "gsap";
import eventHub from "@/utils/eventHub";
import rendererModule from "@/three/rendererModule";
import animate from "./animate";
export default class SphereSky {
  constructor(radius, texture) {
    this.dayToNight = true;
    rendererModule.renderer.toneMappingExposure=0.5
    let sphereSky = new THREE.SphereGeometry(radius, 32, 32);
    let material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
    });
    this.mesh = new THREE.Mesh(sphereSky, material);
    this.mesh.environment = texture;
    let uTime = {
      value: 0,
    };
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uTime;

      shader.fragmentShader.replace(
        "#include <common>",
        `
            #include <common>
            uniform float uTime;
            `
      );
      shader.fragmentShader.replace(
        "#include <dithering_fragment>",
        `
            #include <dithering_fragment>
            float dayStrength=0.0;
            if(abs(uTime-12.0)<4.0){
              dayStrength=1.0;
            }
            if(abs(uTime-12.0)>6.0){
              dayStrength=0.15;
            }
            if(abs(uTime-12.0)>=4.0&&abs(uTime-12.0)<=6.0){
              dayStrength=1.0-(abs(uTime-12.0)-4.0)/2.0;
              dayStrength=clamp(dayStrength,0.15,1.0);
            }
            gl_FragColor=mix(vec4(0.0,0.0,0.0,1.0),gl_FragColor,1.0);
            `
      );
      console.log(shader);
    };

    gsap.to(uTime, {
      value: 24,
      duration: 24,
      repeat: -1,
      ease: "none",
      onUpdate: (time) => {
        if (this.dayToNight) {
         
            eventHub.emit('getHour',uTime.value)
          this.updateSun(uTime.value);

          if(Math.abs(uTime.value - 12) <= 6){
            let dayStrength=this.sun.position.y/1000          
            rendererModule.renderer.toneMappingExposure =dayStrength<0.5?0.5:dayStrength 
          }
        }
      },
    });

    //创建太阳
    let sunGeometry = new THREE.SphereGeometry(100, 32, 32);
    let sunMaterial = new THREE.MeshBasicMaterial({
      emissive: 0xffffaa,
      transparent: true,
    });
    this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
    this.sun.position.set(30, 40, 0);

    //创建直线光
    let sunLight = new THREE.DirectionalLight(0xffffcc, 0.1);
    sunLight.castShadow = true;
    // this.sun.visible=false
    this.sun.add(sunLight);
    this.mesh.add(this.sun);
  }
  updateSun(time) {
    this.sun.position.x = -Math.cos(((time - 6) * 2 * Math.PI) / 24) * 1000;
    this.sun.position.y = Math.sin(((time - 6) * 2 * Math.PI) / 24) * 1000;
  }
  setDayToNight() {
    this.dayToNight = !this.dayToNight;
  }
}
