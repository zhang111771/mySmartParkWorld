import * as THREE from "three"
import gsap from "gsap"
export function getMouseXY(event){
    let mouse=new THREE.Vector3()
    mouse.x=(event.clientX/window.innerWidth)*2-1
    mouse.y=1-(event.clientY/window.innerHeight)*2
    return mouse
}
//节流
export function throttled(fn, delay) {
   
    let timer = null
    let starttime = Date.now()
    return function () {
        let curTime = Date.now() // 当前时间
        let remaining = delay - (curTime - starttime)  // 从上一次到现在，还剩下多少多余时间
        let context = this
        let args = arguments
        clearTimeout(timer)
        if (remaining <= 0) {
         
            fn.apply(context, args)
            starttime = Date.now()
        } else {
            timer = setTimeout(fn, remaining);
          
        }
    }
}
export function randomNumGsap(obj,num=100){
    let randomNum=Math.floor(Math.random()*num)
    gsap.to(obj,{
        value:randomNum,
        duration:1,
        onUpdate:()=>{
            obj.value=Math.floor(obj.value)
        }
    })
}