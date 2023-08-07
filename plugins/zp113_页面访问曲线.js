const ARR = [1, 2, 3]

function init({ container, exc, props }) {
    ARR.forEach(a => container.appendChild(document.createElement("div")))
    exc('load("https://z.zccdn.cn/vendor/highcharts/highcharts_11.1.js")', null, () => { // https://code.hcharts.cn/
        Highcharts.setOptions({ global: { useUTC: false }, accessibility: { enabled: false } })
        exc(`$traffic.page3("${props.page || ""}")`, null, R => {
            if (!R) return
            let x
            let data = []
            Object.keys(R.date).forEach(K => {
                x = K.substr(0, 4) + "/" + K.substr(4, 2) + "/" + K.substr(-2) + " "
                Object.keys(R.date[K]).forEach(k => {
                    data.push([new Date(x + k + ":00").getTime(), R.date[K][k]])
                })
            })
            data.sort((a, b) => b[0] - a[0])
            let chart = JSON.parse(JSON.stringify(chartOption))
            chart.title = { text: "最近3天浏览量 (" + data.reduce((acc, x) => acc + x[1], 0).toLocaleString("en-US") + ")" }
            chart.series = [{ type: "area", name: "浏览量", data }]
            Highcharts.chart(container.firstChild, chart)

            data = []
            Object.keys(R.month).forEach(K => {
                x = K.substr(0, 4) + "/" + K.substr(-2) + "/"
                Object.keys(R.month[K]).forEach(k => {
                    data.push([new Date(x + k + " 01:00").getTime(), R.month[K][k]])
                })
            })
            data.sort((a, b) => b[0] - a[0])
            chart = JSON.parse(JSON.stringify(chartOption))
            chart.title = { text: "最近3个月浏览量 (" + data.reduce((acc, x) => acc + x[1], 0).toLocaleString("en-US") + ")" }
            chart.series = [{ type: "area", name: "浏览量", data }]
            log(chart)
            Highcharts.chart(container.children[1], chart)

            data = []
            Object.keys(R.year).forEach(K => {
                Object.keys(R.year[K]).forEach(k => {
                    data.push([new Date(K + "/" + k + "/01").getTime(), R.year[K][k]])
                })
            })
            data.sort((a, b) => b[0] - a[0])
            chart = JSON.parse(JSON.stringify(chartOption))
            chart.title = { text: "各月浏览量 (" + data.reduce((acc, x) => acc + x[1], 0).toLocaleString("en-US") + ")" }
            chart.series = [{ type: "area", name: "浏览量", data }]
            Highcharts.chart(container.lastChild, chart)
        })
    })
}

$plugin({
    id: "zp113",
    props: [{
        prop: "page",
        type: "text",
        label: "页面路径",
        ph: "默认当前页面"
    }],
    init
})

const dateTime = { "minute": "%H:%M", "hour": "%H:%M", "day": "%m-%d" }
const chartOption = {
    xAxis: { type: "datetime", dateTimeLabelFormats: dateTime },
    yAxis: { title: "" },
    tooltip: { dateTimeLabelFormats: dateTime },
    plotOptions: {
        series: {
            fillColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, "#7cb5ec"],
                    [1, "rgba(124,181,236,0)"]
                ]
            }
        }
    }
}