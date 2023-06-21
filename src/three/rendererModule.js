import * as THREE from 'three'
import {CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer'

class Renderer{
    constructor(){
        this.renderer=new THREE.WebGLRenderer({antialias:true})
        this.renderer.setSize(window.innerWidth,window.innerHeight)
        this.renderer.shadowMap.enabled=true
        this.renderer.toneMapping=THREE.ACESFilmicToneMapping
        this.renderer.toneMappingExposure=1.5
        //css2drenderer
        this.labelRenderer=new CSS2DRenderer()
        this.labelRenderer.setSize(window.innerWidth,window.innerHeight)
        this.labelRenderer.domElement.style.position = 'fixed';
        this.labelRenderer.domElement.style.top = '0px';
        this.labelRenderer.domElement.style.left = '0px';
        this.labelRenderer.domElement.style.zIndex = '10';
        
    }
}
export default new Renderer()