import * as echarts from 'echarts/core'
import {BarChart, PieChart,LineChart} from 'echarts/charts'
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LegendComponent 
  } from 'echarts/components';
  // 标签自动布局、全局过渡动画等特性
  import { LabelLayout, UniversalTransition } from 'echarts/features';
  // 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
  import { CanvasRenderer } from 'echarts/renderers';
  
// 注册必须的组件
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    PieChart,
    BarChart,
    LineChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
    LegendComponent 
  ]);
export function pieCharts(element,data){
 let pieChart=echarts.init(element)
 pieChart.setOption({
    tooltip: {
        trigger: 'item'
      },
      legend: {
        show: true,
        top: "center",
        left: '60%',
        textStyle:{
            color:'#fff'
        }
 
    },
      series: [
        {
          type: 'pie',
          label: {
            show: false,
            position: 'center'
          },
          center:['30%','50%'],
          data: data,
          radius: ['70%', '85%'],
          labelLine: {
            show: false
          },
        }
      ]
 })
 return pieChart
}
export function barRowCharts(element,data){
    let barchart=echarts.init(element)
    let nameData=data.map((item)=>{
        return item.name
    })
    let valueData=data.map((item)=>{
        return item.value
    })
    barchart.setOption({
        grid: {
            left: '5%',
            right: '5%',
            bottom: '0%',
            top: '10%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'none'
            },
            formatter: function(params) {
                return params[0].name + '<br/>' +
                    "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:rgba(36,207,233,0.9)'></span>" +
                    params[0].seriesName + ' : ' + Number((params[0].value.toFixed(4) / 10000).toFixed(2)).toLocaleString() + ' 万元<br/>'
            }
        },
    
        xAxis: {
            show: false,
            type: 'value'
        },
        yAxis: [{
            type: 'category',
            inverse: true,
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#fff'
                },
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            data: nameData
        }, {
            type: 'category',
            inverse: true,
            axisTick: 'none',
            axisLine: 'none',
            show: true,
            axisLabel: {
                textStyle: {
                    color: '#ffffff',
                    fontSize: '12'
                },
    
            },
            data: valueData
        }],
        series: [{
                name: '金额',
                type: 'bar',
                zlevel: 1,
                itemStyle: {
                    normal: {
                     
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0,
                            color: 'rgb(57,89,255,1)'
                        }, {
                            offset: 1,
                            color: 'rgb(46,200,207,1)'
                        }]),
                    },
                },
                barWidth: 10,
                data:valueData
            },
            {
                name: '背景',
                type: 'bar',
                barWidth: 10,
                barGap: '-100%',
                data:  valueData,
                itemStyle: {
                    normal: {
                        color: 'rgba(24,31,68,1)',
                    
                    }
                },
            },
        ]
         
    })
    return barchart
   }
   export function lineBarCharts(element,data){
    let barchart=echarts.init(element)
    let option = {

    
       grid: {
           top: "5%",
           bottom: "13%"//也可设置left和right设置距离来控制图表的大小
       },
       tooltip: {
           trigger: "axis",
           axisPointer: {
               type: "shadow",
               label: {
                   show: true
               }
           }
       },

       xAxis: {
           data: [
               "1",
               "2",
               "3",
               "4",
               "5",
               "6",
               "7",
               "8",
               "9",
               "10",
               "11",
               "12",
           ],
           axisLine: {
               show: true, //隐藏X轴轴线
               lineStyle: {
                           color: '#bac2d0'
                           }
           },
           axisTick: {
               show: true //隐藏X轴刻度
           },
           axisLabel: {
               show: true,
               textStyle: {
                   color: "#bac2d0" //X轴文字颜色
               }
           },
            
       },
       yAxis: [{
    
               nameTextStyle: {
                   color: "#bac2d0"
               },
               splitLine: {
                   show: false
               },
               axisTick: {
                   show: true
               },
               axisLine: {
                   show: true,
                   lineStyle: {
                               color: '#bac2d0'
                               }
               },
               axisLabel: {
                   show: true,
                   textStyle: {
                       color: "#bac2d0"
                   }
               },
                
           }


       ],
       series: [{
               name: "入驻企业",
               type: "line",
               yAxisIndex: 0, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
               smooth: false, //平滑曲线显示
               showAllSymbol: true, //显示所有图形。
               symbol: "circle", //标记的图形为实心圆
               symbolSize: 10, //标记的大小
               itemStyle: {
                   //折线拐点标志的样式
                   color: "#058cff"
               },
               lineStyle: {
                   color: "#058cff"
               },
               areaStyle:{
                   color: "rgba(5,140,255, 0.2)"
               },
               data: data
           },
           {
               name: "主营业务",
               type: "bar",
               barWidth: 10,
               itemStyle: {
                   normal: {
                       color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                               offset: 0,
                               color: "#00FFE3"
                           },
                           {
                               offset: 1,
                               color: "#4693EC"
                           }
                       ])
                   }
               },
               data: data
           }
       ]
   };
   barchart.setOption(option)
   return barchart
   }