import axios from 'axios'

export function POST(params) {
    axios.post(params.url, params.data, params.config).then(function (response) {
        let res = typeof response.data === "string" ? JSON.parse(response.data) : response.data
        if(res.code === 144){
            layerError(res.message)
            localStorage.clear()
            sessionStorage.clear()
            setTimeout(function () {
              location.href = location.protocol + "//" + location.host + "/"
            }, 2000)
            return
        }
        params.callback(res)
    })
}

export function GET(params) {
    axios.get(params.url).then(function (response) {
        let res = typeof response.data === "string" ? JSON.parse(response.data) : response.data
        if(res.code === 144){
            location.href = location.protocol + "//" + location.host + "/#/index/login"
            localStorage.clear()
            sessionStorage.clear()
            layerError(res.message)
            return
        }
        params.callback(res)
    })
}
