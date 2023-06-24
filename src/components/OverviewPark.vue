<template>
  <div class="overviewpark-container">
    <!-- 园区总览 -->
    <div class="num-info">
      <div class="num-info-item">
        <img src="../assets//icons/users.svg" alt="" />
        <div class="info-right">
          <div class="num">{{ personTotal }}</div>
          <div class="label">总人数</div>
        </div>
      </div>
      <div class="num-info-item">
        <img src="../assets//icons/car2.svg" alt="" />
        <div class="info-right">
          <div class="num">{{ carTotal }}</div>
          <div class="label">总车辆数</div>
        </div>
      </div>
      <div class="num-info-item">
        <img src="../assets//icons/tingche.svg" alt="" />
        <div class="info-right">
          <div class="num">{{ carPosition }}</div>
          <div class="label">剩余车位数</div>
        </div>
      </div>
      <div class="num-info-item">
        <img src="../assets//icons/yichang.svg" alt="" />
        <div class="info-right">
          <div class="num">{{ abnormalEq }}</div>
          <div class="label">异常设备数</div>
        </div>
      </div>
    </div>
    <div class="chart-container">
      <div class="chart-item left-item">
        <div class="item-title">
          <img src="@/assets/icons/loudong.svg" alt="" />
          园区信息
        </div>
        <div class="item-body">
          <div class="park-info">
            <div class="info-let">
              <img src="@/assets/imgs/parkmap.png" alt="园区图片" />
            </div>
            <div class="info-right">
              <div class="info-item">
                <span class="info-label">园区名称：</span
                ><span class="info-content">科技城</span>
              </div>
              <div class="info-item">
                <span class="info-label">建成年份：</span
                ><span class="info-content">2021年</span>
              </div>
              <div class="info-item">
                <span class="info-label">物业公司：</span
                ><span class="info-content">重庆xxx</span>
              </div>
              <div class="info-item">
                <span class="info-label">产权归属：</span
                ><span class="info-content">xxxxx</span>
              </div>
              <div class="info-item">
                <span class="info-label">办公租金：</span
                ><span class="info-content">12元/m-20元/m/天</span>
              </div>
            </div>
          </div>
          <div class="num-info-container">
            <div class="num-info-item">
              <div class="info-img">
                <img src="@/assets/icons/mianji.svg" alt="面积" />
              </div>
              <div class="info-right">
                <div class="info-value">87.420</div>
                <div class="info-total">总面积</div>
              </div>
            </div>
            <div class="num-info-item">
              <div class="info-img">
                <img src="@/assets/icons/dalou.svg" alt="楼图标" />
              </div>
              <div class="info-right">
                <div class="info-value">18</div>
                <div class="info-total">楼栋数量</div>
              </div>
            </div>
            <div class="num-info-item">
              <div class="info-img">
                <img src="@/assets/icons/totaluser.svg" alt="人图标" />
              </div>
              <div class="info-right">
                <div class="info-value">6000</div>
                <div class="info-total">办公人数</div>
              </div>
            </div>
            <div class="num-info-item">
              <div class="info-img">
                <img src="@/assets/icons/office.svg" alt="桌子图标" />
              </div>
              <div class="info-right">
                <div class="info-value">541</div>
                <div class="info-total">总办公区域</div>
              </div>
            </div>
            <div class="num-info-item">
              <div class="info-img">
                <img src="@/assets/icons/qiye.svg" alt="企业图标" />
              </div>
              <div class="info-right">
                <div class="info-value">100</div>
                <div class="info-total">总入住企业</div>
              </div>
            </div>
            <div class="num-info-item">
              <div class="info-img">
                <img src="@/assets/icons/pinglv.svg" alt="频率图标" />
              </div>
              <div class="info-right">
                <div class="info-value">70%</div>
                <div class="info-total">入驻率</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="chart-item right-item">
        <div class="item-title">
          <img src="@/assets/icons/loudong.svg" alt="" />
          人车统计
        </div>
        <div class="item-body">
          <div class="pieCharts-outer">
            <div class="pie-center">
              <img src="@/assets/icons/users.svg" alt="" />
              <div class="total-num">{{ personTotal }}</div>
              <div class="total-label">总人数</div>
            </div>
            <div class="pieCharts-container" ref="pieChartsEle"></div>
          </div>
          <div class="tongji-container">
            <div class="tongji-item">
              <div class="tongji-top">
                <span class="top-left">车辆总数</span>
                <span class="top-right">{{ carTotal }}</span>
              </div>
              <div class="tongji-bottom">
                <div class="tongji-container">
                  <div
                    class="tongji-bar bar1"
                    :style="{ width: (carTotal / 300) * 100 + '%' }"
                  ></div>
                </div>
              </div>
            </div>
            <div class="tongji-item">
              <div class="tongji-top">
                <span class="top-left">月卡车辆</span>
                <span class="top-right">{{ moonCar }}</span>
              </div>
              <div class="tongji-bottom">
                <div class="tongji-container">
                  <div
                    class="tongji-bar bar2"
                    :style="{ width: (moonCar / 100) * 100 + '%' }"
                  ></div>
                </div>
              </div>
            </div>
            <div class="tongji-item">
              <div class="tongji-top">
                <span class="top-left">临时车辆</span>
                <span class="top-right">{{ tempCar }}</span>
              </div>
              <div class="tongji-bottom">
                <div class="tongji-container">
                  <div
                    class="tongji-bar bar3"
                    :style="{ width: (tempCar / 200) * 100 + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="chart-item left-item">
        <div class="item-title">
          <img src="@/assets/icons/loudong.svg" alt="" />
          园区配套
        </div>
        <div class="item-body">
          <div class="peitao-container">
            <div class="peitao-item">
              <div class="peitao-num">148</div>
              <div class="peitao-bottom">
                <span class="peitao-label"> 公寓 </span>
                <img src="@/assets/icons/car.svg" alt="" />
              </div>
            </div>
            <div class="peitao-item">
              <div class="peitao-num">148</div>
              <div class="peitao-bottom">
                <span class="peitao-label"> 停车场 </span>
                <img src="@/assets/icons/car.svg" alt="" />
              </div>
            </div>
            <div class="peitao-item">
              <div class="peitao-num">148</div>
              <div class="peitao-bottom">
                <span class="peitao-label"> 舞厅 </span>
                <img src="@/assets/icons/car.svg" alt="" />
              </div>
            </div>
            <div class="peitao-item">
              <div class="peitao-num">148</div>
              <div class="peitao-bottom">
                <span class="peitao-label"> 超市 </span>
                <img src="@/assets/icons/car.svg" alt="" />
              </div>
            </div>
            <div class="peitao-item">
              <div class="peitao-num">148</div>
              <div class="peitao-bottom">
                <span class="peitao-label"> 休闲区 </span>
                <img src="@/assets/icons/car.svg" alt="" />
              </div>
            </div>
            <div class="peitao-item">
              <div class="peitao-num">148</div>
              <div class="peitao-bottom">
                <span class="peitao-label"> 健身区 </span>
                <img src="@/assets/icons/car.svg" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="chart-item right-item">
        <div class="item-title">
          <img src="@/assets/icons/loudong.svg" alt="" />
          警告处理统计
        </div>
        <div class="pieCharts-outer">
          <div class="pie-center">
            <img src="@/assets/icons/users.svg" alt="" />
            <div class="total-num">{{ abnormalEq }}</div>
            <div class="total-label">总数</div>
          </div>
          <div class="pieCharts-container" ref="pieChartsEle2"></div>
        </div>
        <div class="warn-list">
          <div class="warn-item">
            <span class="warn-label">报警</span>
            <span class="warn-num">{{ alarmNum }}</span>
          </div>
          <div class="warn-item">
            <span class="warn-label">误报</span>
            <span class="warn-num">{{ falseReportNum }}</span>
          </div>
          <div class="warn-item">
            <span class="warn-label">测试</span>
            <span class="warn-num">{{ testNum }}</span>
          </div>
        </div>
      </div>
      <div class="chart-item left-item">
        <div class="item-title">
          <img src="@/assets/icons/loudong.svg" alt="" />
          园区产业分布
        </div>
        <div class="item-body">
          <div class="bar-charts" ref="barCharts"></div>
        </div>
      </div>
      <div class="chart-item right-item">
        <div class="item-title">
          <img src="@/assets/icons/loudong.svg" alt="" />
          新入驻企业
        </div>
        <div class="item-body">
          <div class="bar-charts" ref="lineBar"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, reactive } from "vue";
import { pieCharts, barRowCharts, lineBarCharts } from "@/utils/echarts";
import gsap from "gsap";
import eventHub from "@/utils/eventHub";
import { randomNumGsap } from "@/utils/utils";
const pieChartsEle = ref(null);
const pieChartsEle2 = ref(null);
const barCharts = ref(null);
const lineBar = ref(null);
//总人数
let personTotal = ref(0);
//总车辆
let carTotal = ref(0);
//剩余车位
let carPosition = ref(0);
//异常设备数
let abnormalEq = ref(0);
let hour = ref(0);
//访客统计
let visitorPie = ref(null);
//警告统计
let warnPie = ref(null);
//
let barRow = ref(null);
let linecharts = ref(null);
//月卡车辆
let moonCar = ref(0);
//临时车辆
let tempCar = ref(0);
//报警
let alarmNum = ref(0);
//误报
let falseReportNum = ref(0);
//测试
let testNum = ref(0);

onMounted(() => {
  eventHub.on("getHour", (time) => {
    hour.value = Math.floor(time);
    if (hour.value % 6 == 0) {
      randomNumGsap(personTotal, 1000);
      randomNumGsap(carTotal, 300);
      randomNumGsap(carPosition, 300);
      randomNumGsap(alarmNum, 10);
      randomNumGsap(falseReportNum, 20);
      randomNumGsap(testNum, 15);

      updateCharts(visitorPie, [
        {
          value: Math.random() * 100,
          name: "员工",
          itemStyle: {
            color: "#1cbfc9",
          },
        },
        {
          value: Math.random() * 1000,
          name: "访客",
          itemStyle: {
            color: "#7cf6e1",
          },
        },
        {
          value: Math.random() * 50,
          name: "安保",
          itemStyle: {
            color: "#41afe7",
          },
        },
      ]);
      updateCharts(warnPie, [
        {
          value: Math.random() * 15,
          name: "未确认",
          itemStyle: {
            color: "#7cf6e1",
          },
        },
        {
          value: Math.random() * 20,
          name: "已确认",
          itemStyle: {
            color: "#41afe7",
          },
        },
      ]);
      updateCharts(barRow, [
        { name: "商务服务", value: Math.floor(Math.random() * 20) },
        { name: "科研服务", value: Math.floor(Math.random() * 20) },
        { name: "信息技术",value: Math.floor(Math.random() * 20) },
        { name: "批发零售",value: Math.floor(Math.random() * 20) },
        { name: "制造业", value: Math.floor(Math.random() * 20) },
        { name: "仓储运输", value: Math.floor(Math.random() * 20) },
        { name: "房地产业", value: Math.floor(Math.random() * 20) },
        { name: "问题娱乐", value: Math.floor(Math.random() * 20) },
        { name: "金融业", value: Math.floor(Math.random() * 20) },
      ],'barRowCharts');
      updateCharts(linecharts, [
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      ]);
      randomNumGsap(moonCar, 100);
      randomNumGsap(tempCar, 200);
    }
    if (hour.value % 4 == 0) {
      randomNumGsap(abnormalEq, 10);
    }
  });
  //更新echarts
  function updateCharts(charts, data,chartsType) {
    const option = charts.value.getOption();

    option.series.forEach((item)=>{
      item.data=data
    })
    if(chartsType==='barRowCharts'){
      let axisArray=data.map((item)=>{
        return item.value
      })
      option.yAxis[1].data=axisArray
    }
    charts.value.setOption(option);
  }


  visitorPie.value = pieCharts(pieChartsEle.value, [
    {
      value: 335,
      name: "员工",
      itemStyle: {
        color: "#1cbfc9",
      },
    },
    {
      value: 234,
      name: "访客",
      itemStyle: {
        color: "#7cf6e1",
      },
    },
    {
      value: 1548,
      name: "安保",
      itemStyle: {
        color: "#41afe7",
      },
    },
  ]);
  warnPie.value = pieCharts(pieChartsEle2.value, [
    {
      value: 10,
      name: "未确认",
      itemStyle: {
        color: "#7cf6e1",
      },
    },
    {
      value: 22,
      name: "已确认",
      itemStyle: {
        color: "#41afe7",
      },
    },
  ]);
  let barData = [{ name: "商务服务", value: Math.floor(Math.random() * 20) },
        { name: "科研服务", value: Math.floor(Math.random() * 20) },
        { name: "信息技术",value: Math.floor(Math.random() * 20) },
        { name: "批发零售",value: Math.floor(Math.random() * 20) },
        { name: "制造业", value: Math.floor(Math.random() * 20) },
        { name: "仓储运输", value: Math.floor(Math.random() * 20) },
        { name: "房地产业", value: Math.floor(Math.random() * 20) },
        { name: "问题娱乐", value: Math.floor(Math.random() * 20) },
        { name: "金融业", value: Math.floor(Math.random() * 20) },
      ]
  let lineBarData=[
  Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
  ]
  barRow.value = barRowCharts(barCharts.value, barData);
  linecharts.value = lineBarCharts(lineBar.value,lineBarData);
});
</script>
<style lang="scss" scoped>
.overviewpark-container {
  pointer-events: none;
  display: flex;
  justify-content: space-between;

  .bar-charts {
    height: 250px;
  }
  .warn-list {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    .warn-item {
      .warn-num {
        font-size: 15px;
        font-weight: bold;
      }
    }
  }
  .peitao-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .peitao-item {
      width: 135px;
      padding: 15px 5px;
      box-sizing: border-box;
      margin-bottom: 10px;
      background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0),
        rgba(255, 255, 255, 0.2)
      );
      .peitao-num {
        font-size: 14px;
        color: #fff;
      }
      .peitao-bottom {
        display: flex;
        justify-content: space-between;
        .peitao-labe {
        }
        img {
          width: 20px;
        }
      }
    }
  }

  .tongji-container {
    .tongji-item {
      margin-bottom: 15px;
      .tongji-top {
        display: flex;
        justify-content: space-between;
        .top-right {
          font-size: 15px;
        }
      }
      .tongji-bottom {
        .tongji-container {
          border-radius: 2px;
          height: 6px;
          background: #2a354c;
          overflow: hidden;
          .tongji-bar {
            height: 100%;
          }
          .bar1 {
            background: #228ecb;
          }
          .bar2 {
            background: #3dc9d8;
          }
          .bar3 {
            background: #55c6be;
          }
        }
      }
    }
  }
  .pieCharts-outer {
    position: relative;
    .pie-center {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 75px;
      line-height: 15px;
      text-align: center;
      color: #fff;
      font-size: 13px;
      img {
        width: 18px;
      }
    }

    .pieCharts-container {
      width: 100%;
      height: 150px;
    }
  }
  .num-info {
    padding-top: 140px;
    .num-info-item {
      color: #bac2d0;
      margin-bottom: 115px;
      display: flex;
      .label {
      }
      .num {
        font-size: 30px;
        color: #efefef;
      }
      img {
        width: 60px;
        margin-right: 10px;
      }
    }
  }
  .chart-container {
    width: 750px;
    pointer-events: all;
    background: linear-gradient(
      to right,
      rgba(6, 42, 108, 0),
      rgba(6, 42, 108, 0.8) 80%
    );
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-content: start;
    padding: 20px;
    padding-top: 100px;
    flex-wrap: wrap;
  }
  .chart-item {
    height: auto;
    margin-bottom: 15px;
    &.left-item {
      width: 415px;
    }
    &.right-item {
      width: 310px;
    }
    .item-title {
      color: #bac2d0;
      padding-bottom: 10px;
      border-bottom: 1px solid #48dede;
      margin-bottom: 10px;
      img {
        width: 20px;
        vertical-align: bottom;
      }
    }
    .item-body {
      .park-info {
        display: flex;
        margin-bottom: 20px;
        .info-let {
          img {
            width: 160px;
            height: 118px;
          }
        }
        .info-right {
          margin-left: 7px;
          .info-item {
            font-size: 13px;
            margin-bottom: 12px;
            line-height: 13px;
            &.right-item {
              width: 258px;
            }
            .info-label {
              color: #bac2d0;
            }
            .info-content {
              color: #fff;
            }
          }
        }
      }
    }
  }
  .num-info-container {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: space-between;
    .num-info-item {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      width: 135px;
      padding: 15px 5px;
      box-sizing: border-box;
      background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0),
        rgba(255, 255, 255, 0.2)
      );
      .info-img {
        margin-right: 5px;
        height: 100%;
        display: flex;
        align-items: center;
        img {
          width: 20px;
          vertical-align: middle;
        }
      }
    }
    .info-right {
      .info-value {
        color: #fff;
      }
      .info-total {
        color: #bac2d0;
        font-size: 13px;
      }
    }
  }
}
</style>