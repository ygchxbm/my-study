const fs = require("node:fs");
const path = require("node:path");
const axios = require("axios");

const refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiamwyeGFRclhLRVE4Vm1ZSmlNVHYwKzNsWVhVcHpDSG8xZEt3SGJYS1d4MUhUY0ZzbytacndxeW5GZWNsaWJpZUZldFhieVg2M1ArS1VMeXJVQXl4UFUxK1d1Z1EwSUltcnR6WUE1V0Q0aDVUSTdXb05RNWRYdGwxeDFoanlsVEZJb2ViWW1oUitCbGdhVHBvNCtyMGlVSnBMbER5dWZlM1NjNER3NDVpWmZuYTk4Rmx5Y29iU1wvKytmTmZSWTNvNyIsInYiOjMsIml2IjoiaWtuYzA2Uzg5STA0TFwvVlQ4Tm9RQ0E9PSIsImlhdCI6MTcxMjgyNjc3NS4xNDV9.5zP5YgKfrxm-woyBvOfRRuRnxVTmR1XOtKn_c0S_juU';

let accessToken;
const headers = {
    'x-jike-access-token': accessToken
};

//category,播客的类别
//podcast，播客。pid=podcastId，一个播客的id
//episode，播客里一个单集的音频。eid=episodeId，播客里一个单集的id


//刷新，获取最新的access-token
async function refresh() {
    const url = "https://api.xiaoyuzhoufm.com/app_auth_tokens.refresh";
    let res = await axios.post(url, {}, {
        headers: {
            applicationid: 'app.podcast.cosmos', 'app-version': '1.6.0', 'x-jike-device-id': 'f5d56d9a-8530-49a4-a6d2-cfb4b7a31240', 'user-agent': 'okhttp/4.7.2', 'x-jike-refresh-token': refreshToken
        }
    })
    if (res && res.data) {
        return res.data['x-jike-access-token']
    }
}

async function showTime(func, option) {
    const start = performance.now();
    console.log('\n');
    console.log(`${func.name} is running ...`);
    console.log('\n');
    const res = await func(option)
    const end = performance.now();
    console.log('\n');
    console.log(`${func.name} end ———— ${end - start}ms`);
    console.log('\n');
    return res
}

function saveFile(jsonString, filePath) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, jsonString, (err) => {
            if (err) {
                reject(err)
            } else {
                console.log("write successfully", filePath)
                resolve("write successfully")
            }
        });
    })
}

async function filterPidList(pidList, filePath) {
    if (!await pathExists(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]), {encoding: 'utf-8'})
    } else {
        const downloadedPidList = require(filePath);
        return pidList.filter(pid => {
                return !downloadedPidList.includes(pid)
            }
        )
    }

}

/**
 * 第一次运行时打开，将downloaded_xiaoyuzhou.txt文件的值写入downloadedPidList.json，以便后续工作。
 * downloaded_xiaoyuzhou.txt文件为张光琰提供的文件，记录已经下载完5个音频的pid。
 */
async function readDownloadedPidList(a) {
    const filePath = path.resolve(__dirname, './downloaded_xiaoyuzhou.txt');
    const downloadedPidList = fs.readFileSync(filePath, 'utf-8').split(/\r?\n/);
    await saveFile(JSON.stringify(downloadedPidList), './downloadedPidList.json')
}


async function main() {
    accessToken = await refresh();
    headers['x-jike-access-token'] = accessToken;


    // const hzb=await episodes_list('60329b03a6d0c36413c92e6d')

    // await readDownloadedPidList()

    // const categoryRes = await listAll();
    // const categoryIds = categoryRes.data.data.map(item => item.id);
    // let pidList = await getPidList(categoryIds);
    // let pidList = await showTime(getPidList, categoryIds);

    const filePath = path.resolve(__dirname, './pidList.json')
    let pidList = await getPidListFromFile(filePath);

    const oldFilePath = path.resolve(__dirname, 'downloadedPidList.json');
    pidList = await filterPidList(pidList, oldFilePath);
    await saveFile(JSON.stringify(pidList), './pidList.json');

    // const episodes = await getPodcastObj(pidList)
    const podcastObjList = await showTime(getPodcastObj, pidList);

    // const podcastObjList = await getPodcastObjFromFile(path.resolve(__dirname, './podcastObjList.json'));
    // await saveFile(JSON.stringify(podcastObjList), './podcastObjList.json');

    // await downloadAll(podcastObjList);


    await showTime(downloadAll, podcastObjList);

    return 'javascript run end'
}

//获取所有的pid
async function getPidList(categoryIds) {
    let pidList = []
    let pidListArray = [];
    const promiseList = [];

    for (const categoryId of categoryIds) {
        promiseList.push(getCategoryPidList(categoryId, 0));
    }
    // promiseList.push( getCategoryPidList(categoryIds[0], 0));

    pidListArray = await Promise.all(promiseList);
    pidList = pidListArray.flat();

    async function getCategoryPidList(categoryId, loadMoreKey) {
        const categoryPidList = [];
        let listByTabRes = await listByTab(categoryId, "ALL", loadMoreKey)
        categoryPidList.push(...(listByTabRes.data.data.map(item => {
            return item?.podcast.pid;
        })))
        if (listByTabRes.data.loadMoreKey) {
            categoryPidList.push(...(await getCategoryPidList(categoryId, listByTabRes.data.loadMoreKey)))
        }
        return categoryPidList
    }

    return pidList
}

//读取上一次保存文件的所有pid
async function getPidListFromFile(filePath) {
    return require(filePath);
}

async function getPodcastObj(pidList) {
    let episodesPromise = []

    const episodesArray = []
    let i = 1000;
    const length = pidList.length;
    let min = 0;
    let max = 0
    let flag = true;
    while (flag) {
        min = max;
        episodesPromise = [];
        if (i > length) {
            flag = false
            max = length;
        } else {
            max = i
            i += 1000;
        }
        for (const pid of pidList.slice(min, max)) {
            episodesPromise.push(episodes_list(pid))
        }
        //
        episodesArray.push(...await Promise.all(episodesPromise))
    }

    // await saveFile(JSON.stringify(episodesArray), "./episodesArray.json");

    // const episodesArray = require('./episodesArray.json')

    const podcastObj = episodesArray.map((episodes, index) => {
        const pid =pidList[index];
        const children = []
        let num = 0;
        if (episodes.length > 0) {
            // const pid = episodes[0].pid;
            for (const episode of episodes) {
                try {
                    const pid = episode.pid;
                    const eid = episode.eid;
                    let mediaId = episode.media.id;
                    const mediaUrl = episode.media.source.url;
                    const mediaMode = episode.media.source.mode;
                    if (mediaId.includes('/')) {
                        const items = mediaUrl.split('/');
                        mediaId = items[items.length - 1];
                    }
                    if (mediaMode === "PUBLIC") {
                        num++
                        children.push({pid, eid, mediaId, mediaUrl})
                    }
                    if (num >= 5) {
                        break
                    }
                } catch (err) {
                    console.log(episode)
                }
            }
        }
        return {
            pid, children
        }
    })

    return podcastObj
}

async function getPodcastObjFromFile(filePath) {
    return require(filePath);
}

async function downloadAll(podcastObjList) {
    for (const podcastObj of podcastObjList.slice(0, 4)) {
        const pid = podcastObj.pid
        const promiseArray = []
        console.log(pid + ' is downloading...')
        for (const item of podcastObj.children) {
            const filePath = path.resolve(__dirname, `media/${pid}/${item.mediaId}`)
            const url = podcastObj.children[0].mediaUrl;
            promiseArray.push(download(url, filePath));
            // await download(url, filePath)

        }
        const onePodcastMediaDownloadRes = await Promise.all(promiseArray);
        if (onePodcastMediaDownloadRes.filter(item => {
            if (typeof item === "boolean" && item) {
                return item
            }
        }).length === 5) {
            const filePath = path.resolve(__dirname, 'downloadedPidList.json')
            await appendFile(filePath, pid);
        }
    }
}

async function initFile(filePath) {
// 要写入的空JSON对象
    const emptyJson = '[]';

    try {
        fs.writeFileSync(filePath, emptyJson, 'utf8');
        console.log('JSON文件已被清空');
    } catch (err) {
        console.error('清空JSON文件时发生错误:', err);
    }
}

async function appendFile(filePath, pid) {
    if (!await pathExists(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(pid), {encoding: 'utf-8'})
    } else {
        let jsonData = require(filePath);
        if (!Array.isArray(jsonData)) {
            jsonData = [];
        }
        if (pid && !jsonData.includes(pid)) {
            jsonData.push(pid)
            fs.writeFileSync(filePath, JSON.stringify(jsonData), {encoding: 'utf-8'})
        }
    }
}

// 下载音频
async function download(url, filePath) {
    if (!await pathExists(filePath)) {
        try {
            const res = await axios({
                method: 'get',
                url,
                responseType: 'stream'
            })
            const dir = path.dirname(filePath);
            if (!isDirectoryExists(dir)) {
                fs.mkdirSync(dir, {recursive: true});
            }

            return new Promise((resolve, reject) => {
                const writer = fs.createWriteStream(filePath);
                res.data.pipe(writer);
                let error = null;
                writer.on('error', err => {
                    error = err;
                    writer.close();
                    reject(err);
                });

                writer.on('close', () => {
                    if (!error) {
                        resolve(true);
                    }
                });
            });
        } catch (err) {
            // console.log(err)
            return false
        }
    } else {
        return true
    }

}

function isDirectoryExists(dirPath) {
    return fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
}

async function pathExists(filePath) {
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

main().then(res => {
    console.log(res)
});

const bastUrl = "https://www.xiaoyuzhoufm.com"

//获取小宇宙app所有分类
async function listAll() {
    const url = "/v1/category/list-all";
    return await axios.post(bastUrl + url, {}, {headers})

}

//获取一个分类在特定tab下的所有的播客，结果等于getPodcast(podcastId)
async function listByTab(categoryId, tab, loadMoreKey) {
    const url = "/v1/category/podcast/list-by-tab";
    const params = {categoryId, tab, omitSubscribed: false, loadMoreKey};
    return await axios.post(bastUrl + url, params, {headers})
}


//获取播客下的前15个音频,传入num参数后 则获取前num个音频
async function episodes_list(pid) {
    const url = `
    https://www.xiaoyuzhoufm.com/v1/episode/list`;
    const params = {pid};

    try {
        const res = await axios.post(url, params, {headers});
        return res.data.data
    } catch (err) {
        console.log(pid + ' is error');
    }
}


