const ARR = [1, 2, 3]

function init({ container, exc, props }) {
    ARR.forEach(a => container.appendChild(document.createElement("div")))
    exc('load("https://cdn.bootcdn.net/ajax/libs/echarts/5.4.3/echarts.min.js")', null, () => { // https://code.hcharts.cn/
        exc(`$traffic.page3("${props.page || ""}")`, null, R => {
            if (!R) return
            const opt = { title: { left: "center", text: "访问量" }, xAxis: { type: "category" }, yAxis: { type: "value" }, tooltip: { trigger: "axis" }, series: [{ type: "line", smooth: true }] }
            let o = {}
            let x, dates
            Object.keys(R.date).forEach(K => {
                x = K.substr(0, 4) + "-" + K.substr(4, 2) + "-" + K.substr(-2) + " "
                Object.keys(R.date[K]).forEach(k => o[x + k + ":00"] = R.date[K][k])
            })
            opt.title.text = "最近3天浏览量 (" + fm(Object.keys(o).reduce((acc, d) => acc + o[d], 0)) + ")"
            dates = getDates(o, 3600000, "yyyy-MM-dd HH:mm")
            opt.xAxis.data = dates
            opt.series[0].data = dates.map(d => o[d] || 0)
            echarts.init(container.firstChild).setOption(opt)
            //
            o = {}
            Object.keys(R.month).forEach(K => {
                x = K.substr(0, 4) + "-" + K.substr(-2) + "-"
                Object.keys(R.month[K]).forEach(k => o[x + k] = R.month[K][k])
            })
            opt.title.text = "最近3个月浏览量 (" + fm(Object.keys(o).reduce((acc, d) => acc + o[d], 0)) + ")"
            dates = getDates(o, 86400000, "yyyy-MM-dd")
            opt.xAxis.data = dates
            opt.series[0].data = dates.map(d => o[d] || 0)
            echarts.init(container.children[1]).setOption(opt)
            //
            o = {}
            Object.keys(R.year).forEach(K => {
                Object.keys(R.year[K]).forEach(k => o[K + "-" + k] = R.year[K][k])
            })
            opt.title.text = "各月浏览量 (" + fm(Object.keys(o).reduce((acc, d) => acc + o[d], 0)) + ")"
            dates = getDates(o, 86400000 * 31, "yyyy-MM")
            opt.xAxis.data = dates
            opt.series[0].data = dates.map(d => o[d] || 0)
            echarts.init(container.lastChild).setOption(opt)
        })
    })
}

function getDates(o, time, fmt) {
    let arr = Object.keys(o).sort()
    let max = new Date(arr[arr.length - 1]).getTime()
    let cur = new Date(arr[0]).getTime()
    let dates = [arr[0]]
    while (cur < max) {
        cur = new Date(cur + time)
        dates.push(cur.format(fmt))
        cur = cur.getTime()
    }
    return dates
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