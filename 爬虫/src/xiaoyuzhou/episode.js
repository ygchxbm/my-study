//播客的一个单集
const axios = require("axios");
const jsonData=require("./evn.json");
const bastUrl="https://www.xiaoyuzhoufm.com"


const podcastId = "6612b2694f66d1c1da98c6a8";
const url = `/v1/episode/get?eid=${podcastId}`;

const headers = {
    applicationid: 'app.podcast.cosmos',
    'app-version': '1.6.0',
    'x-jike-device-id': 'f5d56d9a-8530-49a4-a6d2-cfb4b7a31240',
    'user-agent': 'okhttp/4.7.2',
    'x-jike-access-token': jsonData['x-jike-access-token']
};


 function getEpisode() {
    axios.get(bastUrl+url, {
        headers: {
            ...headers
        }
    }).then(res => {
        debugger
        console.log(res)
    })
}


getEpisode()

