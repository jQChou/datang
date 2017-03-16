var current_address, weather_url, pm25, energyInterval, environmentInterval = null,
    index = 1,
    energyInterval = null,
    DATE = new Date(),
    year = DATE.getFullYear().toString(),
    mouth = (DATE.getMonth() > 8 && DATE.getMonth() + 1 || ('0' + (DATE.getMonth() + 1).toString())).toString();

function showTime() {
    var now = new Date(),
        hours = now.getHours(),
        mins = now.getMinutes(),
        secs = now.getSeconds(),
        time = "",
        timerID = setTimeout("showTime()", 1000);
    time += ((hours <= 12) ? "   上午   " : "   下午   ");
    time += hours;
    time += ((mins < 10) ? ":0" : ":") + mins;
    time += ((secs < 10) ? ":0" : ":") + secs;
    $('.clock .time').html(time);
};

$('#ca').calendar({
    width: 320,
    height: 320,
    // data: [{
    //         date: '2015/12/24',
    //         value: 'Christmas Eve'
    //     },
    //     {
    //         date: '2015/12/25',
    //         value: 'Merry Christmas'
    //     },
    //     {
    //         date: '2016/01/01',
    //         value: 'Happy New Year'
    //     }
    // ],
    // onSelected: function (view, date, data) {
    //     console.log('view:' + view)
    //     alert('date:' + date)
    //     console.log('data:' + (data || 'None'));
    // }
});


function fullScreen() {
    var el = document.documentElement;
    var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;

    if (typeof rfs != "undefined" && rfs) {
        rfs.call(el);
    } else if (typeof window.ActiveXObject != "undefined") {
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript != null) {
            wscript.SendKeys("{F11}");
        }
    }
}

var environmentWidth = $('.environment-container').width();
var energyWidth = $('.energy').width();

timer = setInterval('go()', 5000);

function go() {
    //计时器的函数
    if (index == 1) {
        index = 2
    } else {
        index = 1;
    };
    selectPic(index);
}

function selectPic(num) {
    if (num === 1) {
        $(".environment-container").addClass("none").siblings().removeClass("none");
        $(".environment-container").animate({
            left: -environmentWidth,
        }, 3000, 'linear');
        $(".energy").animate({
            left: '50px',
        }, 3000, 'linear')
    } else {
        $(".energy").addClass("none").siblings().removeClass("none");
        $(".energy").animate({
            left: -energyWidth,
        }, 3000, 'linear');
        $(".environment-container").animate({
            left: '0px',
        }, 3000, 'linear')
    }
    clearInterval(timer);
    timer = setInterval('go()', 12000);
}

$.ajax({
    type: 'get',
    url: 'http://api.map.baidu.com/location/ip?ak=1d86e3b5d994cd5f46514b7c3d1c1723',
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
                $('.date').text(data.date);
                showTime();
                temperature = data.results[0].weather_data[0].temperature;
                weather = data.results[0].weather_data[0].weather;
                weather.split('')[weather.split('').length - 1] === "晴" && $('.weatherIcon').addClass('icon-qing');
                weather.split('')[weather.split('').length - 1] === "雨" && $('.weatherIcon').addClass('icon-xiaoyu');
                weather.split('')[weather.split('').length - 1] === "雪" && $('.weatherIcon').addClass('icon-xue');
                weather.split('')[weather.split('').length - 1] === "云" && $('.weatherIcon').addClass('icon-cloudy');
                weather.split('')[weather.split('').length - 1] === "阴" && $('.weatherIcon').addClass('icon-yin');
                // pm25 = data.results[0].pm25;
                $('.currentweather').text(weather);
                $('.currentTemperature').text(temperature);
                var gaugeOptions = {
                    chart: {
                        type: 'gauge',
                        backgroundColor: 'rgba(255, 255, 255, 0)',
                        plotBorderColor: null,
                        plotBackgroundColor: null,
                        plotBackgroundImage: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        borderWidth: 0,
                        plotBorderWidth: 0,
                        plotShadow: false
                    },
                    title: {
                        text: 'PM2.5'
                    },
                    credits: {
                        enabled: false
                    },
                    exporting: {
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
                        data: [pm25 || 0],
                        tooltip: {
                            valueSuffix: ' μm/m3'
                        }
                    }]
                };
                $('#container-pm25').highcharts(Highcharts.merge(gaugeOptions,
                    function (chart) {
                        if (!chart.renderer.forExport) {
                            var point = chart.series[0].points[0];
                            // point.update(Number(pm25));
                        }
                    }
                ));
                $.ajax({
                    type: "POST",
                    url: "/api/business/globalavg",
                    dataType: "json",
                    success: function (data) {
                        var temperature = data.result.temperature,
                            humidity = data.result.humidity,
                            voc = data.result.voc;
                        pm25 = data.result.pm25;
                        var chart = $('#container-pm25').highcharts(),
                            point;
                        if (chart) {
                            point = chart.series[0].points[0];
                            point.update(Number(pm25));
                        }
                        $('.temperatureRead').text(temperature);
                        $('.humidityRead').text(humidity);
                        $('.VOCRead').text(voc);
                        $('.pm25Read').text(pm25);
                    },
                    error: function (err) {}
                });
            },
            error: function (err) {
                console.log(err);
            }
        });
    },
    error: function (err) {
        console.log(err);
    }
});
$.ajax({
    type: "POST",
    url: "api/business/runtimecurve",
    dataType: "json",
    success: function (data) {
        var pm25Array = [],
            temperatureArray = [],
            humidityArray = [];
        for (var i in data.result.pm25) {
            pm25Array.push(data.result.pm25[i]);
        }
        for (var i in data.result.humidity) {
            humidityArray.push(data.result.humidity[i]);
        }
        for (var i in data.result.temperature) {
            temperatureArray.push(data.result.temperature[i]);
        }
        $('#container-pm').highcharts({
            chart: {
                backgroundColor: 'rgba(255, 255, 255, 0)',
                plotBorderColor: null,
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: null,
                plotShadow: false,
                borderWidth: 0
            },
            exporting: {
                enabled: false
            },
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
                data: pm25Array
            }]
        });
        $('#container-ws').highcharts({
            chart: {
                backgroundColor: 'rgba(255, 255, 255, 0)',
                plotBorderColor: null,
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: null,
                plotShadow: false,
                borderWidth: 0
            },
            exporting: {
                enabled: false
            },
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
                data: temperatureArray
            }, {
                type: 'spline',
                yAxis: 1,
                name: '湿度',
                tooltip: {
                    valueSuffix: '%'
                },
                data: humidityArray
            }]
        });
    },
    error: function (err) {
        console.log(err);
    }
});

$.ajax({
    url: "/api/business/monthlykgce",
    type: "POST",
    dataType: "json",
    data: JSON.stringify({
        time: year + mouth,
        project: 'PROJECT'
    }),
    contentType: 'application/json',
    success: function (data) {
        $('.kgceperunitarea').text(data.result.PROJECT.kgceperunitarea);
        $('.kwhperunitarea').text(data.result.PROJECT.kwhperunitarea);
        var series = [];
        for (var i in data.result.PROJECT.detail) {
            var a = [i, data.result.PROJECT.detail[i]];
            series.push(a);
        }
        $('#container-energy').highcharts({
            chart: {
                style: {
                    textAlign: 'center'
                },
                type: 'pie',
                backgroundColor: 'rgba(255, 255, 255, 0)',
                plotBorderColor: null,
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: null,
                plotShadow: false,
                borderWidth: 0
            },
            title: {
                text: '<div class="pieTitle">月综合能耗</div><div class="pieNumber">' + data.result.PROJECT.kgce + '</div><div class="pieUnit">千克煤</div>',
                verticalAlign: 'middle',
                useHTML: true,
                y: -60
            },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: ' <b>{point.y}</b> 千克煤'
            },
            plotOptions: {
                pie: {
                    dataLabels: false,
                    innerSize: '93%',
                    showInLegend: true
                }
            },
            exporting: {
                enabled: false
            },
            legend: {
                verticalAlign: 'middle',
                layout: 'vertical',
                labelFormatter: function () {
                    return '<div style="text-align:left;">' + (Math.round(this.percentage * 10) / 10) + '% ' + this.name + '</div><div style="color:#BBB;text-align:left;">' + this.y + 'KGce</div>';
                },
                itemWidth: 100,
                useHTML: true,
                x: 600
            },
            series: [{
                tooltip: {
                    valueSuffix: '%'
                },
                data: series
            }]
        });
    },
    error: function (err) {
        console.log(err);
    }
});
$.ajax({
    url: "/api/business/monthlykgce",
    type: "POST",
    dataType: "json",
    data: JSON.stringify({
        time: year + ((parseInt(mouth) - 1 < 10) && ('0' + (parseInt(mouth) - 1).toString()) || (parseInt(mouth) - 1).toString()),
        project: 'PROJECT'
    }),
    contentType: 'application/json',
    success: function (data) {
        if (parseInt(mouth) - 1 > 0) {
            $($('.lastMouth')[0]).text(((parseInt(mouth) - 1 < 10) && ('0' + (parseInt(mouth) - 1).toString()) || (parseInt(mouth) - 1).toString()) + '月')
            $($('.lastMouth')[1]).text(data.result.PROJECT.kgce)
        } else {
            $('.lastMouth').text('');
            $($('.mouthFont .pieUnit')[0]).text('');
        };
    },
    error: function (err) {
        console.log(err);
    }
});
$.ajax({
    url: "/api/business/monthlykgce",
    type: "POST",
    dataType: "json",
    data: JSON.stringify({
        time: year + ((parseInt(mouth) - 2 < 10) && ('0' + (parseInt(mouth) - 2).toString()) || (parseInt(mouth) - 2).toString()),
        project: 'PROJECT'
    }),
    contentType: 'application/json',
    success: function (data) {
        if (parseInt(mouth) - 2 > 0) {
            $($('.twoMouthAgo')[0]).text(((parseInt(mouth) - 2 < 10) && ('0' + (parseInt(mouth) - 2).toString()) || (parseInt(mouth) - 2).toString()) + '月')
            $($('.twoMouthAgo')[1]).text(data.result.PROJECT.kgce)
        } else {
            $('.twoMouthAgo').text('');
            $($('.mouthFont .pieUnit')[1]).text('');
        };
    },
    error: function (err) {
        console.log(err);
    }
});
$.ajax({
    url: "/api/business/monthlykgce",
    type: "POST",
    dataType: "json",
    data: JSON.stringify({
        time: year + ((parseInt(mouth) - 3 < 10) && ('0' + (parseInt(mouth) - 3).toString()) || (parseInt(mouth) - 3).toString()),
        project: 'PROJECT'
    }),
    contentType: 'application/json',
    success: function (data) {
        if (parseInt(mouth) - 3 > 0) {
            $($('.threeMouthAgo')[0]).text(((parseInt(mouth) - 3 < 10) && ('0' + (parseInt(mouth) - 3).toString()) || (parseInt(mouth) - 3).toString()) + '月')
            $($('.threeMouthAgo')[1]).text(data.result.PROJECT.kgce)
        } else {
            $('.threeMouthAgo').text('');
            $($('.mouthFont .pieUnit')[2]).text('');
        };
    },
    error: function (err) {
        console.log(err);
    }
});


$.ajax({
    type: "POST",
    url: "api/business/airquality",
    dataType: "json",
    success: function (data) {},
    error: function (err) {
        console.log(err);
    }
});