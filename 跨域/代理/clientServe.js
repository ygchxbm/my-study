const express = require('express')
const path = require('node:path')

const app = new express();

const baseUrl = 'http://127.0.0.1:3009'
const useProxyApi = (req, res,next) => {
    const reqUrl = req.url
    req.agencyUrl=baseUrl + reqUrl
    next()

}

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './index.html'))
})

let id = 0;
app.post('/getText', useProxyApi,(req, res) => {
    id++;
    const data = {id}
    fetch(req.agencyUrl, {
        method: 'post',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((res =>
                res.json()
        ))
        .then((data => {
            res.send(data)
        }))
})

app.listen(3001, () => {
    console.info('http://127.0.0.1:3001')
})
