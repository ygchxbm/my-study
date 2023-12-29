const express = require('express')
// const path = require('node:path')
const bodyParser = require('body-parser')

const app = new express();
app.use(bodyParser.json())

app.post('/getText', (req, res) => {
    console.info('getText success')
    const {id}=req.body;
    if (id % 2 === 0) {
        res.send(JSON.stringify('hello hzb'))
    } else {
        res.send(JSON.stringify('hello bzh'))
    }
})

app.listen(3009, () => {
    console.info('http://127.0.0.1:3009')
})
