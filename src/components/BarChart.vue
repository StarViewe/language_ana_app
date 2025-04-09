<template>
    <div ref="chartContainer" style="width: 100%; height: 400px;"></div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

const chartContainer = ref(null)

const c = () => {
    return 100
}

onMounted(() => {
    const chart = echarts.init(chartContainer.value)
    const option = {
        title: {
            text: '难度等级报告图',
            subtext: '*参照《中国英语能力等级量表》（2018）',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function (params) {
                return params[1].name + '<br/>' + params[1].seriesName + ' : ' + params[0].data;
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            splitLine: { show: false },
            data: ['三级', '四级', '五级', '六级', '七级'],
        },
        yAxis: {
            type: 'value',
            min: 3
        },
        series: [
            {
                name: 'Placeholder',
                type: 'bar',
                stack: 'Difficulty',
                itemStyle: {
                    borderColor: 'transparent',
                    color: 'transparent'
                },
                emphasis: {
                    itemStyle: {
                        borderColor: 'transparent',
                        color: 'transparent'
                    }
                },
                data: [3, 4, 5, 6, 7]
            },
            {
                name: '难度等级',
                type: 'bar',
                stack: 'Difficulty',
                label: {
                    show: false,
                    position: 'inside'
                },
                itemStyle: {
                    normal: {
                        color: function (params) {
                            const colors = ['#66BB6A', '#FFEB99', '#FFB74D', '#FF7043', '#F48FB1'];
                            return colors[params.dataIndex];
                        }
                    }
                },
                data: [1, 1, 1, 1, 1],
                barWidth: '100%',
            }
        ],
        graphic: {
            elements: [{
                type: 'line',
                shape: {
                    //经过测试，x轴坐标为31.5的时候可以与y轴重合,y1为60的时候与y轴最上方平齐
                    //一格柱子的宽度为97
                    x1: 128.5, y1: 60, // 起点坐标
                    x2: 128.5, y2: 369 // 终点坐标
                },
                style: {
                    stroke: '#000000',
                    lineWidth: 2
                },
                z: 10
            }, {
                type: 'text', // 添加文本
                style: {
                    x: 135, // 设置文本的横坐标
                    y: 60, // 设置文本的纵坐标
                    text: '4.00', // 要显示的数字
                    fill: '#000000', // 文本颜色
                    font: 'bold 16px Arial' // 字体和大小
                },
                z: 20 // 设置z值确保文本在上面
            }]
        }
    };


    chart.setOption(option)
})
</script>
<!--     var center = ['50%', '70%']
    var radius = ['40%', '70%'] -->
<!-- const option = {
    title: {
        text: '难度等级报告图',
        subtext: '*参照《中国英语能力等级量表》（2018）',
        left: 'center'
    },
    legend: {
        top: '15%',
        left: 'center'
    },
    series: [
        {
            name: 'Access From',
            type: 'pie',
            radius,
            center,
            startAngle: 180,
            endAngle: 360,
            data: [
                { value: 100, name: '三级' },
                { value: 100, name: '四级' },
                { value: 100, name: '五级' },
                { value: 100, name: '六级' },
                { value: 100, name: '七级' }
            ],
        },
    ],
    graphic: {
        elements: [{
            type: 'line', // 类型为线
            shape: { // 定义线的起点和终点坐标
                x1: 280, y1: 0, // 起点坐标
                x2: 270, y2: 280 // 终点坐标
            },
            style: {
                stroke: '#000000', // 线颜色
                lineWidth: 2 // 线宽
            }
        }]
    }
}; -->