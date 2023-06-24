<template>
  <div class="big-screen">
    <header>
      <div class="block-container">
        <div class="block-item logo"><img src="" alt="" /> 智慧园区</div>
        <div class="block-item">
          <img src="@/assets/icons/loudong.svg" alt="" class="icon" /> 园区总览
        </div>
        <div class="block-item">
          <img src="@/assets/icons/kouzhao.svg" alt="" class="icon" /> 防疫防控
        </div>
        <div class="block-item">
          <img src="@/assets/icons/dunpai.svg" alt="" class="icon" /> 智慧安防
        </div>
        <div class="block-item">
          <img src="@/assets/icons/shebei.svg" alt="" class="icon" /> 设备管理
        </div>
        <div class="block-item">
          <img src="@/assets/icons/car.svg" alt="" class="icon svg" /> 车辆管理
        </div>
        <div class="block-item">
          <img src="@/assets/icons/nenghao.svg" alt="" class="icon" /> 智慧能耗
        </div>
        <div class="block-item">
          <img src="@/assets/icons/shangye.svg" alt="" class="icon" /> 智慧商业
        </div>
        <div class="block-item">
          <img src="@/assets/icons/woshou.svg" alt="" class="icon" /> 招商引资
        </div>
      </div>
      <div class="header-right">
        <div class="weather-container">
          <div class="weather-item">
            <img src="@/assets/icons/colorWeather/duoyun.svg" alt="" />
            <div class="weather-right">
              <div class="right-top">多云转阴</div>
              <div class="right-bottom">20~30℃</div>
            </div>
          </div>
          <div class="weather-item">
            <img src="@/assets/icons/arrow.svg" alt="" />
            <div class="weather-right">
              <div class="right-top">北风</div>
              <div class="right-bottom">1~3级</div>
            </div>
          </div>
          <div class="weather-item">
            <img src="@/assets/icons/colorWeather/yezi.svg" alt="" />
            <div class="weather-right">
              <div class="right-top">空气良</div>
              <div class="right-bottom">50</div>
            </div>
          </div>
        </div>
        <div class="time-container">
          <div class="date-contaienr">
            <span class="date">2023-6-18</span>
            <span class="day">星期天</span>
          </div>
          <div class="time">
            {{ hour.count }}:07:15
          </div>
        </div>
      </div>
    </header>
    <main>
        <div class="showhandles">
  
    
            <div class="handle-item" @click="toggleMonitor">
                <img src="@/assets/icons/shexiangtou.svg" alt="">
            </div>
            <div class="handle-item" @click="togglePersons">
                <img src="@/assets/icons/kouzhao.svg" alt="">
            </div>
            <!-- <div class="handle-item">
                <img src="@/assets/icons/miehuoqi.svg" alt="">
            </div> -->
            <div class="handle-item" @click="toggleLight">
                <img src="@/assets/icons/ludeng.svg" alt="">
            </div>
        </div>
      <OverviewPark></OverviewPark>
    </main>
    <footer>
      <div class="time-line-container">
        <div class="time-line-list">
          <div class="time-line-item">
            <img src="@/assets/icons/clock.svg" alt="时间图标" />
          </div>
          <div class="time-line-item" :class="{active:hour.count>=6&&hour.count<11}">
            <img src="@/assets/icons/richu.svg" alt="日出图标" />
            清晨
          </div>
          <div class="time-line-item" :class="{active:hour.count>=11&&hour.count<15}">
            <img src="@/assets/icons/sun.svg" alt="太阳图标" />
            中午
          </div>
          <div class="time-line-item" :class="{active:hour.count>=15&&hour.count<19}">
            <img src="@/assets/icons/riluo.svg" alt="日落图标" />
            傍晚
          </div>
          <div class="time-line-item" :class="{active:hour.count>=19||(hour.count>=0&&hour.count<6)}">
            <img src="@/assets/icons/moon.svg" alt="月亮图标" />
            夜里
          </div>
        </div>
      </div>
      <div class="weather-container">
        <div class="weather-list">
          <div class="weather-item">
            <img src="@/assets/icons/duoyun.svg" alt="云朵太阳图标" />
          </div>
          <div class="weather-item" :class="{active:weather.name==='晴天'}">
            <img src="@/assets/icons/yintian.svg" alt="云朵图标" />
            晴天
          </div>
          <div class="weather-item" :class="{active:weather.name==='雨天'}">
            <img src="@/assets/icons/rain.svg" alt="云朵太阳图标" />
            雨天
          </div>
          <div class="weather-item" :class="{active:weather.name==='下雪'}">
            <img src="@/assets/icons/snow.svg" alt="云朵太阳图标" />
            下雪
          </div>
          <div class="weather-item" :class="{active:weather.name==='有雾'}">
            <img src="@/assets/icons/wu.svg" alt="云朵太阳图标" />
            有雾
          </div>
        </div>
      </div>
      <button class="realtime-btn">实时</button>
    </footer>
  </div>
</template>
<script setup>
import OverviewPark from "./OverviewPark.vue";
import eventHub from "@/utils/eventHub";
import { onBeforeMount, onMounted,reactive,ref } from "vue";
let hour=reactive({count:0})
let weather=reactive({name:null})


onMounted(()=>{
  eventHub.on('getWeahter',(value)=>{
    weather.name=value
  })
  eventHub.on('getHour',(value)=>{
    hour.count=parseInt(value)
  })
  

})
const toggleMonitor=()=>{

  eventHub.emit('toggleMonitor')
}
const toggleLight=()=>{

eventHub.emit('toggleLight')
}
const togglePersons=()=>{
eventHub.emit('togglePersons')

}


</script>
<style lang='scss' scoped>
.big-screen {
  header {
    display: flex;
    justify-content: space-between;
    position: relative;
    z-index: 10;
    .header-right{
        display: flex;
        padding-right:22px;
        .weather-container{
            display: flex;
            .weather-item{
                display: flex;
                align-items: center;
                margin-right:25px;
                img{
                    width:35px;
                    margin-right:5px;
                }
                .weather-right{
                    .right-top{

                    }
                    .right-bottom{
                        font-size: 25px;
                        font-weight: bold;
                    }
                }
            }
        }
        .time-container{
            .time{
                font-weight: bold;
                font-size: 25px;
            }
        }
    }
  }
  box-shadow: inset 0px 0px 100px 0px #062a6c;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  padding: 20px;
  overflow: hidden;
  box-sizing: border-box;
  z-index: 100;
  .block-container {
    pointer-events: all;
    display: flex;
    align-items: center;
    .block-item {
      .icon {
        width: 22px;
        height: 22px;
        color: #fff;
        vertical-align: bottom;
      }
      .svg {
        fill: currentColor;
        color: #fff;
      }
      margin-right: 45px;
      color: #bac2d0;
      font-size: 16px;
      &.active {
        color: #fff;
      }
      &.logo {
        // color:#2479b7;
        font-size: 30px;
        font-weight: bold;
        background-image: -webkit-linear-gradient(top, #2479b7, #30cbe4);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
  main {
    .showhandles{
        position:fixed;
        top:150px;
        right:777px;
        z-index: 50;
        .button-item{
          background: rgba(0,0,0,0.5);
          padding:5px;
          margin-bottom:30px;
          pointer-events: all;
          cursor: pointer;
          text-align: center;
          border-radius: 5px;
        }
        .handle-item{
      
            pointer-events: all;
            background: rgba(0,0,0,0.5);
            border-radius: 50%;
            margin-bottom:30px;
            padding:5px;
          
            img{
                pointer-events: all;
                cursor: pointer;
                width:40px;
            }
            
        }
    }
    .aside-left {
      pointer-events: all;
    }
    .aside-right {
      pointer-events: all;
    }
  }
  footer {
    position: fixed;
    left: 50px;
    width: 100vw;
    bottom: 50px;
    display: flex;
    .realtime-btn {
      background: #060c18;
      color: #fff;
      width: 50px;
      border: 1px solid #fff;
      cursor: pointer;
      pointer-events: all;
    }
    .weather-container {
      margin-left: 80px;
      .weather-list {
        display: flex;
        pointer-events: all;
        display: flex;
        pointer-events: all;
        align-items: center;
        .weather-item {
          display: flex;
          align-items: center;
          color: #fff;
          margin-right: 35px;
          background-color: rgba(31, 36, 53, 0.5);
          &.active {
            background-color: rgba(5, 141, 234, 0.9);
          }
          padding: 5px 10px;
          img {
            width: 20px;
            margin-right: 5px;
          }
          &:first-child {
            img {
              margin-right: 0;
            }
          }
        }
      }
    }
    .time-line-container {
      .time-line-list {
        display: flex;
        pointer-events: all;
        align-items: center;
        .time-line-item {
          display: flex;
          align-items: center;
          color: #fff;
          margin-right: 35px;
          background-color: rgba(31, 36, 53, 0.5);
          &.active {
            background-color: rgba(5, 141, 234, 0.9);
          }
          padding: 5px 10px;
          img {
            width: 20px;
            margin-right: 5px;
          }
          &:first-child {
            img {
              margin-right: 0;
            }
          }
        }
      }
    }
  }
}
</style>