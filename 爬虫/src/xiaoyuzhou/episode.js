//播客的一个单集
const baseRequest = require("./baseRequest");

const episodeId = "6612b2694f66d1c1da98c6a8";

function getEpisode(episodeId) {
    const url = `/v1/episode/get?eid=${episodeId}`;
    const methods = "get";
    const params = {};
    return baseRequest({url, methods, params})
}


// getEpisode(episodeId).then(res => {
//     console.log(res.status)
// }).catch(err => {
//     console.log(err.code)
// });

exports.getEpisode = getEpisode

