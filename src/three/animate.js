import rendererModule from './rendererModule'
import SceneModule from './sceneModule'
import CameraModule from './CameraModule'
import ControlsModule from './ControlsModule'
import * as THREE from 'three'
import composerModule from './composerModule'
class Animate{
    constructor(){
       this.fns=[]
        this.animateUpdate()
        
    }
    animateUpdate(){
        
        const clock=new THREE.Clock()
       
        const animate= ()=>{
            const elapsedTime= clock.getElapsedTime()
            const deltaTime=clock.getDelta()
            // rendererModule.renderer.render(SceneModule.scene,CameraModule.activeCamera)
            //更新后期效果
            composerModule.composer.render()
            rendererModule.labelRenderer.render(SceneModule.scene,CameraModule.activeCamera)

            ControlsModule.controls.update()
            this.animateCall({elapsedTime,deltaTime})
            requestAnimationFrame(animate)
        }
        animate()
      
    }
    animateCall({elapsedTime,deltaTime}){
        this.fns.forEach((fn)=>{
            fn({elapsedTime,deltaTime})
        })
    }
    addAnimate(fn){
        this.fns.push(fn)
    }
   
}
export default new Animate()