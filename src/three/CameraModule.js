import * as THREE from 'three'
import sceneModule from './sceneModule'
import gsap from 'gsap'
class CameraModule{
    constructor(){
        const defaultCamera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,2000)
        // defaultCamera.position.set(-400,50,-100)
        defaultCamera.position.set(0,0,0)
 

        this.cameras={
            default:defaultCamera,
        }
        sceneModule.scene.add(defaultCamera)
        this.activeCamera=this.cameras.default
    }

}
export default new CameraModule()