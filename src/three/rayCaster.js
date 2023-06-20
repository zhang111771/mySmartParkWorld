import * as THREE from 'three'

import CameraModule from './CameraModule'
class Raycaster{
    constructor(){
        this.raycaster=new THREE.Raycaster()
    }
    getIntersectObject(mouse,mesh){
        this.raycaster.setFromCamera(mouse,CameraModule.activeCamera)
        const getIntersectObject=this.raycaster.intersectObject(mesh)
        return getIntersectObject
    }
    getIntersectObjects(mouse,meshArray){
        this.raycaster.setFromCamera(mouse,CameraModule.activeCamera)
        const getIntersectObjects=this.raycaster.intersectObjects(meshArray,false)
        return getIntersectObjects
    }
}
export default new Raycaster()