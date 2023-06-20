import * as THREE from "three"

export function getMouseXY(event){
    let mouse=new THREE.Vector3()
    mouse.x=(event.clientX/window.innerWidth)*2-1
    mouse.y=1-(event.clientY/window.innerHeight)*2
    return mouse
}