var current_address, weather_url, pm25;
$.ajax({
    type: 'get',
    url: 'http:////api.map.baidu.com/location/ip?ak=1d86e3b5d994cd5f46514b7c3d1c1723',
    dataType: 'jsonp',
    jsonp: "callback",
    jsonpCallback: "success_jsonpCallback",
    success: function (data) {
        current_address = data.content.address_detail.city
        weather_url = 'http://api.map.baidu.com/telematics/v3/weather?location=' + current_address + '&output=json&ak=1d86e3b5d994cd5f46514b7c3d1c1723'
        $.ajax({
            type: 'get',
            url: weather_url,
            dataType: 'jsonp',
            jsonp: "callback",
            jsonpCallback: "success_jsonpCallback2",
            success: function (data) {
                pm25 = data.results[0].pm25;

                var gaugeOptions = {
                    chart: {
                        type: 'gauge',
                        plotBackgroundColor: null,
                        plotBackgroundImage: null,
                        plotBorderWidth: 0,
                        plotShadow: false
                    },
                    title: {
                        text: 'PM2.5'
                    },
                    credits: {
                        enabled: false
                    },
                    pane: {
                        startAngle: -150,
                        endAngle: 150,
                        background: [{
                            backgroundColor: {
                                linearGradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 0,
                                    y2: 1
                                },
                                stops: [
                                    [0, '#FFF'],
                                    [1, '#333']
                                ]
                            },
                            borderWidth: 0,
                            outerRadius: '109%'
                        }, {
                            backgroundColor: {
                                linearGradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 0,
                                    y2: 1
                                },
                                stops: [
                                    [0, '#333'],
                                    [1, '#FFF']
                                ]
                            },
                            borderWidth: 1,
                            outerRadius: '107%'
                        }, {
                            // default background
                        }, {
                            backgroundColor: '#DDD',
                            borderWidth: 0,
                            outerRadius: '105%',
                            innerRadius: '103%'
                        }]
                    },
                    // the value axis
                    yAxis: {
                        min: 0,
                        max: 500,
                        minorTickInterval: 'auto',
                        minorTickWidth: 1,
                        minorTickLength: 10,
                        minorTickPosition: 'inside',
                        minorTickColor: '#666',
                        tickPixelInterval: 30,
                        tickWidth: 2,
                        tickPosition: 'inside',
                        tickLength: 10,
                        tickColor: '#666',
                        labels: {
                            step: 2,
                            rotation: 'auto'
                        },
                        title: {
                            text: 'μm/m3'
                        },
                        plotBands: [{
                            from: 0,
                            to: 50,
                            color: '#00A286' // Good
                        }, {
                            from: 50,
                            to: 100,
                            color: '#FFE300' // Moderate
                        }, {
                            from: 100,
                            to: 150,
                            color: '#EE9200' // Unhealthy for Sensitive Groups
                        }, {
                            from: 150,
                            to: 200,
                            color: '#DD001E' // Unhealthy
                        }, {
                            from: 200,
                            to: 300,
                            color: '#74009A' // Very Unhealthy
                        }, {
                            from: 300,
                            to: 400,
                            color: '#89001A' // Hazardous
                        }, {
                            from: 400,
                            to: 500,
                            color: '#89001A' // Hazardous
                        }]
                    },
                    series: [{
                        name: 'PM2.5',
                        data: [80],
                        tooltip: {
                            valueSuffix: ' μm/m3'
                        }
                    }]
                };
                $('#container-pm25').highcharts(Highcharts.merge(gaugeOptions, {
                    function (chart) {
                        if (!chart.renderer.forExport) {
                            var point = chart.series[0].points[0];
                            point.update(Number(pm25));
                        }
                    }
                }));

                var chart = $('#container-pm25').highcharts(),
                    point;
                if (chart) {
                    point = chart.series[0].points[0];
                    point.update(Number(pm25));
                }
                console.log(data);
                $('.clock .date').html(data.date);
            },
            error: function (err) {
                console.log('error', err);
            }
        });
    },
    error: function (err) {
        console.log('error', err);
    },
});

$('#container-pm').highcharts({
    title: {
        text: 'PM2.5小时浓度变化',
        x: -20 //center
    },
    // subtitle: {
    //     text: 'Source: WorldClimate.com',
    //     x: -20
    // },
    xAxis: {
        categories: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', ]
    },
    yAxis: {
        title: {
            text: 'PM2.5(μm/m3)'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#e4393c'
        }]
    },
    tooltip: {
        valueSuffix: 'μm/m3'
    },
    credits: {
        enabled: false
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
    },
    series: [{
        name: 'pm2.5',
        data: [7.0, 6.9, 9.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6, 3.1, 21, 12, 22]
    }]
});

$('#container-ws').highcharts({
    title: {
        text: '温湿度小时变化',
        x: -20 //center
    },
    credits: {
        enabled: false
    },
    // subtitle: {
    //     text: 'Source: WorldClimate.com',
    //     x: -20
    // },
    xAxis: {
        categories: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', ]
    },
    yAxis: [{
        title: {
            text: '湿度 (%)'
        },
        opposite: true,
        plotLines: [{
            value: 0,
            width: 1,
            color: '#e4393c'
        }]
    }, {
        title: {
            text: '温度 (°C)'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    }],
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
    },
    series: [{
        type: 'line',
        yAxis: 0,
        name: '温度',
        tooltip: {
            valueSuffix: '°C'
        },
        data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
    }, {
        type: 'spline',
        yAxis: 1,
        name: '湿度',
        tooltip: {
            valueSuffix: '%'
        },
        data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
    }]
});