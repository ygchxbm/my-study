const express =require('express');
const path = require("node:path");
const app=new express();

app.use(express.static(path.join(__dirname,"static")));

// app.use((req, res, next)=>{
//     // console.info("path.resolve(__dirname,'static'+'.'+req.path):", path.resolve(__dirname,'static'+req.path+'.js'))
//     res.sendFile(path.resolve(__dirname,req.path))
// })

app.listen(8000,()=>{
    console.info("http://127.0.0.1:8000" )
})
