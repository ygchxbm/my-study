const cheerio = require("cheerio");

const baseRequest = require("./baseRequest");
const podcastId = "61791d921989541784257779";

function podcastWeb(podcastId) {
    const url = `/podcast/${podcastId}`;
    const methods = "get";
    const params = {};
    return baseRequest({url, methods, params})
}

// podcastWeb(podcastId).then(res => {
//     const $ = cheerio.load(res.data);
//     const page_data = JSON.parse($('#__NEXT_DATA__')[0].children[0].data);
//     const episodes = page_data.props.pageProps.podcast.episodes;
//     debugger
//     // console.log(episodes[0])
//     console.log(episodes.length)
// }).catch(err => {
//     console.log(err.code)
// })

exports.podcastWeb = podcastWeb;
