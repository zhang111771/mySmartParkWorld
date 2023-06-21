import {
    EffectComposer,
    RenderPass,
    SelectiveBloomEffect,
    BlendFunction,
    EffectPass,
    SMAAEffect,
    OutlineEffect,
  } from "postprocessing";
import rendererModule from "./rendererModule";
import sceneModule from "./sceneModule";
import CameraModule from "./CameraModule";
class Composer{
    constructor(){
        //实例化后期处理效果
        this.composer=new EffectComposer(rendererModule.renderer)
        this.composer.addPass(new RenderPass(sceneModule.scene,CameraModule.activeCamera))
        //添加发光效果
        this.bloomEffect=new SelectiveBloomEffect(sceneModule.scene,CameraModule.activeCamera,{
            blendFunction: BlendFunction.ADD,
            edgeStrength: 3,
            pulseSpeed: 0,
            visibleEdgeColor: 0xffffff,
            hiddenEdgeColor: 0x22090a,
            blur: false,
            xRay: true,
            usePatternTexture: false,
        })
        //添加轮廓效果
        // 添加轮毂效果
            this.outlineEffect = new OutlineEffect(sceneModule.scene, CameraModule.activeCamera, {
                blendFunction: BlendFunction.ADD,
                edgeStrength: 3,
                pulseSpeed: 0,
                visibleEdgeColor: 0xffffff,
                hiddenEdgeColor: 0x22090a,
                blur: false,
                xRay: true,
                usePatternTexture: false,
            });
        //添加outlinePass
        this.outlinePass=new EffectPass(CameraModule.activeCamera,this.outlineEffect)
        this.composer.addPass(this.outlinePass)
        //添加抗锯齿效果
        this.smaaEffect=new SMAAEffect()
        //添加效果通道
        this.effectPass=new EffectPass(CameraModule.activeCamera,this.bloomEffect,this.smaaEffect)
        this.composer.addPass(this.effectPass)
    }
}
export default new Composer()