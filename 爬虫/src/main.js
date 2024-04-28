const fs = require("fs");
const path = require('node:path')
const axios = require("axios");
const refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiamwyeGFRclhLRVE4Vm1ZSmlNVHYwKzNsWVhVcHpDSG8xZEt3SGJYS1d4MUhUY0ZzbytacndxeW5GZWNsaWJpZUZldFhieVg2M1ArS1VMeXJVQXl4UFUxK1d1Z1EwSUltcnR6WUE1V0Q0aDVUSTdXb05RNWRYdGwxeDFoanlsVEZJb2ViWW1oUitCbGdhVHBvNCtyMGlVSnBMbER5dWZlM1NjNER3NDVpWmZuYTk4Rmx5Y29iU1wvKytmTmZSWTNvNyIsInYiOjMsIml2IjoiaWtuYzA2Uzg5STA0TFwvVlQ4Tm9RQ0E9PSIsImlhdCI6MTcxMjgyNjc3NS4xNDV9.5zP5YgKfrxm-woyBvOfRRuRnxVTmR1XOtKn_c0S_juU';

const url = "https://api.xiaoyuzhoufm.com/app_auth_tokens.refresh";


async function getToken() {
    const refreshRes = await axios.post(url, {}, {headers: {'x-jike-refresh-token': refreshToken}});
    return refreshRes.data['x-jike-access-token']
}

async function getEpisodes(podcastId) {
    const accessToken = await getToken();
    const url = `https://www.xiaoyuzhoufm.com/v1/episode/list`;
    const params = {
        "pid": podcastId,
        "limit": 25,
    };
    const headers = {
        'x-jike-access-token': accessToken
    };
    const res = await axios.post(url, params, {headers})
    return res.data.data
}


function getPodcastIds() {
    const path1 = path.resolve(__dirname, './downloaded_xiaoyuzhou.txt');
    const oldData = fs.readFileSync(path1, 'utf-8').split(/\r?\n/);
    const newData = require('./podcastId.json');
    const myNeed = [];
    newData.forEach(item => {
        if (!oldData.includes(item)) {
            myNeed.push(item)
        }
    })

    return myNeed;
}


async function writeFile(data, filePath) {
    const writer = fs.createWriteStream(filePath);
    data.pipe(writer)
    return new Promise((resolve, inject) => {
        writer.on('finish', () => {
            // console.log('File downloaded successfully.');
            resolve('success');
        });

        writer.on('error', (err) => {
            // console.error('Error writing to file:', err.message);
            resolve(err);
        });
    })

}

async function main() {
    const downloadedIds = []
    const podcastIds = getPodcastIds();
    for (const podcastId of podcastIds) {
        const episodes = await getEpisodes(podcastId);
        console.log("podcastId:", podcastId)
        let num = 0
        for (const episode of episodes) {
            let mediaId = episode.media.id;
            const mediaUrl = episode.media.source.url;
            const mediaMode = episode.media.source.mode;
            if (mediaId.includes('/')) {
                const items = mediaUrl.split('/');
                mediaId = items[items.length - 1];
            }
            if (mediaMode === "PUBLIC") {
                const dirPath = path.resolve(__dirname, `./media/${podcastId}`);
                if (!isDirectoryExists(dirPath)) {
                    fs.mkdirSync(dirPath, {recursive: true});
                }

                const mediaRes = await axios({
                    url: mediaUrl,
                    method: 'get',
                    responseType: 'stream'
                });
                const filePath = path.resolve(dirPath, mediaId);
                if (!await pathExists(filePath)) {
                    console.log("mediaId:", mediaId +' '+ ' downloading...');
                    const writeRes = await writeFile(mediaRes.data, filePath);
                    console.log(writeRes)
                } else {
                    console.log("mediaId:", mediaId);
                }
                num++
                if (num >= 5) {
                    break
                }
            }
        }
        downloadedIds.push(podcastId)
    }
    return downloadedIds
}

main().then(res => {
    fs.writeFile('./result.json', JSON.stringify(res), err => {
        if (err) {
            console.log(err)
        } else {
            console.log('success')
        }
    })
})


function isDirectoryExists(dirPath) {
    return fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
}

function pathExists(filePath) {
    return new Promise((resolve, reject) => {
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    // 文件不存在
                    resolve(false);
                } else {
                    // 其他错误
                    reject(err);
                }
            } else {
                // 文件存在
                resolve(true);
            }
        });
    });
}
