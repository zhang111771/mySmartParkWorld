import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import CameraModule from './CameraModule'
import rendererModule from './rendererModule'
import * as THREE from 'three'
class ControlsModule{
    constructor(){
        this.controls =new OrbitControls(CameraModule.activeCamera,rendererModule.labelRenderer.domElement)
        this.controls.target= new THREE.Vector3(-420,0,-150)
        this.controls.enableDamping=true
    }
}
export default new ControlsModule()