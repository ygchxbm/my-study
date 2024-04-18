//播客
const axios = require("axios");
const jsonData=require("./evn.json");
const bastUrl="https://www.xiaoyuzhoufm.com"


const podcastId = "652c966636a1383a6662920a"


const headers = {
    applicationid: 'app.podcast.cosmos',
    'app-version': '1.6.0',
    'x-jike-device-id': 'f5d56d9a-8530-49a4-a6d2-cfb4b7a31240',
    'user-agent': 'okhttp/4.7.2',
    'x-jike-access-token': jsonData['x-jike-access-token']
};


//获取播客信息
function getPodcast(){
    const url = `/v1/podcast/get?pid=${podcastId}`;
    axios.get(bastUrl+url, {
        headers
    }).then(res => {
        debugger
        console.log(res)
    })
}
getPodcast();

//获取播客的单集信息
function episodeList(){
    const url = `/v1/episode/list`;
    const params = {
        "pid": podcastId,
        "limit": 25,
    }
    axios.post(bastUrl+url, params,{
        headers
    }).then(res => {
        debugger
        console.log(res)
    })
}
episodeList();
