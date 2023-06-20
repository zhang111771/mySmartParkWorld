<template>
    <div ref="container"></div>
</template>
<script setup>
import init from '../three/init'
import {ref,onMounted} from 'vue'
import rendererModule from '../three/rendererModule'
const container=ref(null)

onMounted(()=>{
    container.value.appendChild(rendererModule.renderer.domElement)
    container.value.appendChild(rendererModule.labelRenderer.domElement)

    
    init()
})


</script>