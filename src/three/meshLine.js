import * as THREE from "three";
import spreadFragment from "../shader/spreadFragment.glsl";
import spreadVertex from "../shader/spreadVertex.glsl";
import animate from "./animate";
import gsap from "gsap";
export default class MeshLine {
  constructor(geometry) {
    const edges = new THREE.EdgesGeometry(geometry);
    this.material = new THREE.ShaderMaterial({
      fragmentShader: spreadFragment,
      vertexShader: spreadVertex,
      uniforms: {
        uToTopLineTime: {
          value: 0,
        },
        uToTopLineWidth: {
          value: 5,
        },
        uColor: {
          value: new THREE.Color("#aaaeff"),
        },
        uOpacity:{
            value:false
        }
      },
    });
    gsap.to(this.material.uniforms.uToTopLineTime, {
      value: 100,
      duration: 3,
      ease: "none",
      repeat: -1,
    });

    const line = new THREE.LineSegments(edges, this.material);

    this.geometry = edges;
    this.mesh = line;
  }
}
