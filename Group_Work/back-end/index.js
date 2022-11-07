const hospital = require('./hospital_class_porperty')
const data = require('./hospital_information.json')
const http = require('http')
const port = 8080;
const findHospitalID = require('./searchFn/findKey');
const findListHospitalName  =require('./searchFn/findName')
const { rmSync } = require('fs');
const path = require('path');
// 1. create newData with only data we need
let newDatas = []


data.map((item, index) => {
    const { tunnus, orderNum, hospitalName, address, organisaatio, postinumero } = item
    let newData = new hospital(tunnus, orderNum, hospitalName, address, organisaatio, postinumero)

    newDatas.push(newData)
})

// 2. find data with only private hospital
let hospitalPrivate = []
newDatas.map((item, index) => {
    (item['organisaatio'].toLowerCase().includes('oy')) && (hospitalPrivate.push(item))
})

//   2.1 now we can send data all the private name: 

const server = http.createServer((req, res) => {
    const newUrl = new URL(`http://${req.headers.host}${req.url}`)
    const { searchParams, host, port, pathname, search } = newUrl
    if (pathname === '/') {
        res.writeHead(200, {
            "Content-Type": 'text/json; charset = utf-8'
        })
        res.end(JSON.stringify({ status: 200, msg: 'success', hospitalPrivate }))
    }
    else if (pathname === '/find') {
        res.writeHead(200, {
            "Content-Type": 'text/json; charset = utf-8'
        })
        // let find the list by their tunnus
        if (searchParams.has('id')){

            let foundList = findHospitalID(searchParams.get('id'), hospitalPrivate)
            res.end(JSON.stringify({ foundList }))
        }
        if (searchParams.has('name')){
            let foundList = findListHospitalName(searchParams.get('name'), hospitalPrivate)
            res.end(JSON.stringify({ foundList }))
        }

    }
    else {
        res.writeHead(404)
        res.end('resource not found')
    }
})
server.listen(port, () => {
    console.log(`listening on port : ${port}.....`)
})