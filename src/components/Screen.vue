<template>
  <div ref="container"></div>
</template>
<script setup>
import init from "../three/init";
import { ref, onMounted } from "vue";
import rendererModule from "../three/rendererModule";
const container = ref(null);

onMounted(() => {
  container.value.appendChild(rendererModule.renderer.domElement);
  container.value.appendChild(rendererModule.labelRenderer.domElement);

  init();
});
</script>
<style lang="scss" >
.personTag {
  background-image: url(../assets/icons/walking.svg);
  background-position: center center;
  width: 40px;
  height: 40px;
  background-repeat: no-repeat;
  background-size: 30px 30px;
  border-radius: 50%;
  background-color: rgb(6, 202, 148);
  border: 3px solid #fff;
  pointer-events: auto;
}

.css2dlabel {
  font-size: 30px;
}
.infoTag {
  background-color: rgba(6, 42, 108, 0.5);
  padding: 10px;
  width: 200px;
  .closeInfo{
    text-align: right;
    button{
        padding:5px;
        background: transparent;
        border:none;
        cursor: pointer;
    }
  }
  .btn-container {
    text-align: right;
    button {
      background: #060c18;
      color: #fff;
      width: 50px;
      border: 1px solid #fff;
      cursor: pointer;
      pointer-events: all;
    }
  }
  .info-item {
    margin-bottom: 10px;
    .info-label {
    }
  }
  .info-item-btn {
    text-align: center;
    .confirm-btn {
      background: rgb(6,148,247);
      color: #fff;
    padding:5px 10px;
    border:none;
      cursor: pointer;
      pointer-events: all;
    }
  }
}
.lightTag {
  background-image: url(../assets/icons/ludeng.svg);
  background-position: center center;
  width: 40px;
  height: 40px;
  background-repeat: no-repeat;
  background-size: 30px 30px;

  background-color: rgb(205, 173, 7);
  border: 3px solid #fff;
}
.monitorTag {
  background-image: url(../assets/icons/shexiangtou.svg);
  background-position: center center;
  width: 40px;
  height: 40px;
  background-repeat: no-repeat;
  background-size: 30px 30px;

  background-color: rgb(32, 127, 188);
  border: 3px solid #fff;
}
.info-title {
  margin-bottom: 10px;
}
.handle-btns {
  text-align: center;
  margin-top: 10px;
  pointer-events: all;
  button {
    border: none;
    padding: 5px 10px;
    &.off_light {
      background: rgb(67, 72, 99);
    }
    &.on_light {
      background: rgb(19, 109, 156);
      margin-right: 10px;
    }
  }
}
</style>