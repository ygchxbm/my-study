const episode = require('./episode');
const podcast = require('./podcast');
const category = require('./category');
const search = require('./search');
const SSLHUB=require('./SSL HUB')

module.exports = {
    ...episode,
    ...podcast,
    ...category,
    ...search,
    ...SSLHUB
}


// const episodeId = "6612b2694f66d1c1da98c6a8";
// episode(episodeId);

// const podcastId = "652c966636a1383a6662920a";
// podcast.getPodcast(podcastId)
// podcast.episodeList(podcastId)
