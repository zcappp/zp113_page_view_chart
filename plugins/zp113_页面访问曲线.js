const ARR = [1, 2, 3]

function init({ container, exc, props }) {
    ARR.forEach(a => container.appendChild(document.createElement("div")))
    exc('load("https://cdn.bootcdn.net/ajax/libs/echarts/5.4.3/echarts.min.js")', null, () => { // https://code.hcharts.cn/
        exc(`$traffic.page3("${props.page || ""}")`, null, R => {
            if (!R) return
            let x
            let data = []
            Object.keys(R.date).forEach(K => {
                x = K.substr(0, 4) + "-" + K.substr(4, 2) + "-" + K.substr(-2) + " "
                Object.keys(R.date[K]).forEach(k => data.push([x + k + ":00", R.date[K][k]]))
            })
            data.sort((a, b) => b[0] - a[0])

            const opt = { title: { left: "center", text: "访问量" }, xAxis: { type: "category" }, yAxis: { type: "value" }, tooltip: { trigger: "axis" }, series: [{ type: "line", smooth: true }] }
            opt.title.text = "最近3天浏览量 (" + fm(data.reduce((acc, x) => acc + x[1], 0)) + ")"
            opt.xAxis.data = data.map(a => a[0])
            opt.series[0].data = data.map(a => a[1])
            echarts.init(container.firstChild).setOption(opt)
            //
            data = []
            Object.keys(R.month).forEach(K => {
                x = K.substr(0, 4) + "-" + K.substr(-2) + "-"
                Object.keys(R.month[K]).forEach(k => data.push([x + k, R.month[K][k]]))
            })
            data.sort((a, b) => b[0] - a[0])
            opt.title.text = "最近3个月浏览量 (" + fm(data.reduce((acc, x) => acc + x[1], 0)) + ")"
            opt.xAxis.data = data.map(a => a[0])
            opt.series[0].data = data.map(a => a[1])
            echarts.init(container.children[1]).setOption(opt)
            //
            data = []
            Object.keys(R.year).forEach(K => {
                Object.keys(R.year[K]).forEach(k => data.push([K + "-" + k, R.year[K][k]]))
            })
            data.sort((a, b) => b[0] - a[0])
            opt.title.text = "各月浏览量 (" + fm(data.reduce((acc, x) => acc + x[1], 0)) + ")"
            opt.xAxis.data = data.map(a => a[0])
            opt.series[0].data = data.map(a => a[1])
            echarts.init(container.lastChild).setOption(opt)
        })
    })
}

function fm(n) {
    return n.toLocaleString("en-US")
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