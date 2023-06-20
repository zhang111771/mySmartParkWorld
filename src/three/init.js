
import animate from "./animate";
import AddMesh from './addMesh'
import cameraModule from './CameraModule'
import rendererModule from "./rendererModule";
export default function init(){
    window.addEventListener("resize", () => {
          //   console.log("resize");
          // 更新摄像头
          cameraModule.activeCamera.aspect = window.innerWidth / window.innerHeight;
          //   更新摄像机的投影矩阵
          cameraModule.activeCamera.updateProjectionMatrix();
        
          //   更新渲染器
          rendererModule.renderer.setSize(window.innerWidth, window.innerHeight);
          //   设置渲染器的像素比例
          rendererModule.renderer.setPixelRatio(window.devicePixelRatio);
        });
    const addMesh=new AddMesh()
}