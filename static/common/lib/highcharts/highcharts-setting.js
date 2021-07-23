/* HIGHCHARTS SETTING : swiper  */
var $highchartsBox = $('.highcharts-box');
if($highchartsBox.length > 0){
    $highchartsBox.each(function(index){
        var $graphSwiper = $(this).find('.swiper-container');
        var index = index+1;
        $graphSwiper.addClass('graph-swiper' + index);
        var swiper = new Swiper('.graph-swiper' + index, {
            slidesPerView: 'auto',
            centeredSlides: 'true',
            pagination: {
                el: $('.graph-swiper' + index).find('.swiper-pagination'),
                type: 'bullets',
                clickable: 'true',
            },
            navigation: {
                nextEl: $('.graph-swiper' + index).find('.swiper-button-next'),
                prevEl: $('.graph-swiper' + index).find('.swiper-button-prev'),
            },
        });
    });
};

/* HIGHCHARTS OPTIONS  */
var $chartObj = $('.chart_target');
// column type 01
var dataLabels = {
    enabled: true,
    formatter: function () { 
        return gfn_comma3Digit(this.point.y) + "원"
    },
    padding: 10,
    backgroundColor: "#FFF",
    shadow: true,
    y: -10,
    borderRadius: 2,
    verticalAlign: 'bottom',
    style: {
        fontWeight: "bold",
        fontSize: '16px',
        fontFamily: "KBFGText"
    }
}
/* COLOR THEME */
var colorTheme01 = {
    colors: ['#ffd338', '#fa7b4e'],
    point: '#fa7b4e'
}
var colorTheme02 = {
    colors: ['#01cec9', '#edf0f4']
}
var colorTheme03 = {
    colors: ['#edf0f4', '#01cec9']
}
var colorTheme04 = {
    colors: ['#ffe170', '#96857f']
}
/* CHART OPTION */
//column
var columnOption = {
    chart: {
        type: "column",
    },
    title: {
        text: ""
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    tooltip: {
        enabled: false
    },
    label : {
        fontFamily: 'KBFGText'
    },
    xAxis: {
        type: "category",
        categories: [],
        labels: {
            style: {
                color: "#aab0b8",
                fontSize: "14px",
            }
        }
    },
    yAxis: {
        enabled: false,
        gridLineColor: "#dde1e4",
        labels: { enabled: false },
        title: { enabled: false },
        tickWidth: 1,
        gridLineColor:"#dde1e4"
    },
    plotOptions: {
        series: {
            pointWidth: 20,
            borderRadiusTopLeft: "50%",
            borderRadiusTopRight: "50%"
        }
    },
    series: [{data: []}]
};
function setColumnChart(chartTarget, dataOption, themeOption, chartCategory, chartData){
    if($chartObj){
        $chartObj.each( function(){
            var columnChart = new Highcharts.Chart(chartTarget, Highcharts.merge(dataOption, themeOption));
            columnChart.xAxis[0].setCategories(chartCategory);
            columnChart.series[0].setData(chartData);
        });
    }
}

//column + area
var columnAreaOption = {
    chart: {
        type: "xy"
    },
    title: {
        text: ""
    },
    legend: {
        y: 20,
        align: "center",
        itemDistance: 35,
        reversed: true,
        itemStyle: {
            fontFamily: "KBFGText",
            fontSize: '14px',
            color: '#26282c',
            fontWeight: 'normal'
        }
    },
    credits: {
        enabled: false
    },
    tooltip: { enabled: false },
    exporting: { enabled: false },
    label : {
        style: {
            fontFamily: "roboto"
        }
    },
    xAxis:{
        labels: {
            style: {
                color: "#aab0b8",
                fontSize: "14px",
            }
        },
        tickWidth: 1,
        gridLineWidth: 1,
        categories: [],
    },
    yAxis: [
        {// Primary yAxis (기본 ; 영역)
            labels: { enabled: false },
            title: { enabled: false },
            gridLineColor: "transparant"
        },
        {// Secondary yAxis (추가 ; 막대)
            title: {
                text: "",
            },
            labels: { enabled: false },
            opposite: true
        }
    ],
    plotOptions: {
        series: {
            borderRadiusTopLeft: "50%",
            borderRadiusTopRight: "50%",
            pointWidth: 15 // 막대그래프 너비
        },
        area: {
            marker: { enabled: false },
            lineWidth: 0
        }
    },
    series: [
        {// 기본 그래프
            type: "area",
            data: [],
            fillOpacity: 0.8
        },
        {// 추가 그래프
            type: "column",
            data: []
        }
    ]
};
function setColumnAreaChart(chartTarget, dataOption, themeOption, chartCategory, chartData1, chartData2, dataName1, dataName2){
    if($chartObj){
        $chartObj.each( function(){
            var columnAreaChart = new Highcharts.Chart(chartTarget, Highcharts.merge(dataOption, themeOption));
            columnAreaChart.xAxis[0].setCategories(chartCategory);
            columnAreaChart.series[0].setData(chartData1);
            columnAreaChart.series[1].setData(chartData2);
            columnAreaChart.legend.allItems[0].update({name:dataName1});
            columnAreaChart.legend.allItems[1].update({name:dataName2});
            columnAreaChart.redraw();
        });
    }
}

//double column
var doubleColumnOption = {
    chart: {
        type: "areaspline"
    },
    title: {
        text: ""
    },
    legend: {
        y: 20,
        align: "center",
        itemDistance: 35,
        reversed: true,
        itemStyle: {
            fontFamily: "KBFGText",
            fontSize: '14px',
            color: '#26282c',
            fontWeight: 'normal'
        }
    },
    credits: {
        enabled: false
    },
    tooltip: { enabled: false },
    exporting: { enabled: false },
    xAxis: {
        labels: {
            style: {
                color: "#aab0b8",
                fontSize: "14px",
            }
        },
        allowDecimals: false,
        tickInterval: 5,
        tickWidth: 1,
        gridLineWidth: 1
    },
    yAxis: {
        labels: { enabled: false },
        title: { enabled: false },
        gridLineColor: "transparant"
    },
    plotOptions: {
        series: {
            marker: {
                enabled: false
            },
            lineWidth: 0
        }
    },
    series: [
        {data: [],fillOpacity: 0.5},
        {data: [],fillOpacity: 0.5}
    ]
};
function setDoubleAreaChart(chartTarget, dataOption, themeOption, chartData1, chartData2, dataName1, dataName2){
    if($chartObj){
        $chartObj.each( function(){
            var doubleAreaChart = new Highcharts.Chart(chartTarget, Highcharts.merge(dataOption, themeOption));
            doubleAreaChart.series[0].setData(chartData1);
            doubleAreaChart.series[1].setData(chartData2);
            doubleAreaChart.legend.allItems[0].update({name:dataName1});
            doubleAreaChart.legend.allItems[1].update({name:dataName2});
            doubleAreaChart.redraw();
        });
    }
}
//bar
var barOption = {
    chart: {
        type: "bar"
    },
    title: {
        text: ""
    },
    legend: {
        y: 20,
        align: "center",
        itemDistance: 35,
        itemStyle: {
            fontFamily: "KBFGText",
            fontSize: '14px',
            color: '#26282c',
            fontWeight: 'normal'
        },
        symbolHeight: 10,
        symbolWidth: 10,
    },
    credits: {
        enabled: false
    },
    tooltip: { enabled: false },
    exporting: { enabled: false },
    xAxis: {
        type: "category",
        categories: [],
        title: {
            text: null
        },
        labels: {
            style: {
                fontFamily: "KBFGText",
                fontSize: '14px',
                color: '#26282c',
                fontWeight: 'normal'
            }
        }
    },
    yAxis: {
        labels: { enabled: false },
        title: { enabled: false },
        tickInterval: 50,
    },
    plotOptions: {
        series: {
            borderRadiusTopLeft: "50%",
            borderRadiusTopRight: "50%",
            pointWidth: 10,
        }
    },
    series: [
        {data: []},
        {data: []}
    ]
};
function setBarChart(chartTarget, dataOption, themeOption, chartCategory, chartData1, chartData2, dataName1, dataName2){
    if($chartObj){
        $chartObj.each( function(){
            var barChart = new Highcharts.Chart(chartTarget, Highcharts.merge(dataOption, themeOption));
            barChart.xAxis[0].setCategories(chartCategory);
            barChart.series[0].setData(chartData1);
            barChart.series[1].setData(chartData2);
            barChart.legend.allItems[0].update({name:dataName1});
            barChart.legend.allItems[1].update({name:dataName2});
            barChart.redraw();
        });
    }
}
// spline + Area
var splineAreaOption = {
    chart: {
        type: "xy"
    },
    title: {
        text: ""
    },
    legend: {
        y: 20,
        align: "center",
        itemDistance: 35,
        reversed: true,
        itemStyle: {
            fontFamily: "KBFGText",
            fontSize: '14px',
            color: '#26282c',
            fontWeight: 'normal'
        }
    },
    credits: {
        enabled: false
    },
    tooltip: { enabled: false },
    exporting: { enabled: false },
    label : {
        style: {
            fontFamily: "roboto"
        }
    },
    xAxis:{
        labels: {
            style: {
                color: "#aab0b8",
                fontSize: "14px",
            }
        },
        tickWidth: 1,
        gridLineWidth: 1,
        categories: [],
    },
    yAxis: [
        {// Primary yAxis (기본 ; 영역)
            labels: { enabled: false },
            title: { enabled: false },
            gridLineColor: "transparant"
        },
        {// Secondary yAxis (추가 ; 막대)
            title: {
                text: "",
            },
            labels: { enabled: false },
            opposite: true
        }
    ],
    plotOptions: {
        series: {
            borderRadiusTopLeft: "50%",
            borderRadiusTopRight: "50%",
            pointWidth: 15 // 막대그래프 너비
        },
        area: {
            marker: { enabled: false },
            lineWidth: 0
        }
    },
    series: [
        {// 기본 그래프
            type: "area",
            data: [],
            fillOpacity: 0.8
        },
        {// 추가 그래프
            type: "spline",
            data: []
        }
    ]
};