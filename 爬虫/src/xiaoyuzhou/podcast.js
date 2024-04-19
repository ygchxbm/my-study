//播客
const baseRequest = require("./baseRequest");

const podcastId = "652c966636a1383a6662920a"


//获取播客信息
function getPodcast(podcastId) {
    const url = `/v1/podcast/get?pid=${podcastId}`;
    const methods = "get";
    const params = {};
    return baseRequest({url, methods, params})
}

//获取播客的单集信息
function episodeList(podcastId) {
    const url = `/v1/episode/list`;
    const methods = "post";
    const params = {
        "pid": podcastId,
        "limit": 25,
    };
    return baseRequest({url, methods, params})
}

getPodcast("5e280fa7418a84a0461f8e98\n").then(res => {
    console.log(res.status)
    console.log(res.data.data)
}).catch(err => {
    console.log(err.code)
})
// episodeList(podcastId).then(res => {
//     console.log(res.status)
// }).catch(err => {
//     console.log(err.code)
// })


exports.getPodcast = getPodcast;
exports.episodeList = episodeList;

