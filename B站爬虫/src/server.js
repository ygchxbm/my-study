const express = require('express');
const path = require("node:path");
const bodyParser = require('body-parser');
const app = new express();
const {saveBV,keyWordSearch,margeBV,margeAllBV} = require('./utils/BApi.js')

app.use(express.json());
app.use(bodyParser.json()); // 解析 application/json 类型的数据
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
})

app.post("/BVId", async (req, res) => {
    const BVId = req.body?.BVId;
    if (BVId) {
        await saveBV(BVId);
        res.send({message: 'success', data: BVId})
    } else {
        res.send({message: 'error! BVId is error', data: null})
    }
})

app.post("/keyword", async (req, res) => {
    const keyword = req.body?.keyword;
    if (keyword) {
        await keyWordSearch(keyword);
        res.send({message: 'success', data: keyword})
    } else {
        res.send({message: 'error! keyword is error', data: null})
    }
})

app.post("/marge", async (req, res) => {
    const BVId = req.body?.BVId;
    if (BVId) {
        await margeBV(BVId);
        res.send({message: 'success', data: BVId})
    } else {
        res.send({message: 'error! BVId is error', data: null})
    }
})

app.post("/margeAll", async (req, res) => {
    await margeAllBV();
    res.send({message: 'success', data: null})
})

app.listen(8000, () => {
    console.info("http://127.0.0.1:8000")
})
