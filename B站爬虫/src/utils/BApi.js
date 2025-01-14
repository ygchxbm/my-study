const path = require("node:path");
const fs = require("node:fs");
const axios = require("axios");
const {JSDOM} = require("jsdom");
const ffmpeg = require("ffmpeg-static");
const {execSync} = require("child_process");

const dirPath = path.resolve(__dirname, `../saveFile/BVs`)

const saveBV = async (BVId) => {
    console.log('')
    if (!BVId) {
        console.error('BVId不存在！')
    }
    console.log(`${BVId}开始`)
    const infoFileUrl = path.resolve(dirPath, BVId, `${BVId}.json`);
    const videoFileUrl = path.resolve(dirPath, BVId, `${BVId}.mp4`);
    const audioFileUrl = path.resolve(dirPath, BVId, `${BVId}.mp3`);
    const isDirExists = fs.existsSync(dirPath);
    let isInfoExists, isVideoExists, isAudioExists;
    if (!isDirExists) {
        fs.mkdirSync(dirPath, {recursive: true})
    } else {
        isInfoExists = fs.existsSync(infoFileUrl);
        isVideoExists = fs.existsSync(videoFileUrl);
        isAudioExists = fs.existsSync(audioFileUrl);
    }
    if (!(isInfoExists && isVideoExists && isAudioExists)) {
        const res = await getBVAllInfo(BVId);
        if (res) {
            const {videoUrl, audioUrl} = await saveBVInfo(res);
            await getBVVideo(videoUrl);
            await getBVAudio(audioUrl);
        }

    } else {
        console.log("视频所有信息已存在");
    }

    console.log(`${BVId}结束`)


    async function getBVAllInfo(BVId) {
        const url = `https://www.bilibili.com/video/${BVId}/?spm_id_from=333.337.search-card.all.click`;
        console.log('1///////////////////////////////////////////////////////')
        console.log("视频网页信息请求中......");
        try {
            const res = await axios({
                method: 'get', url,
            })

            if (res) {
                console.log("视频网页信息请求完毕");
                return res
            } else {
                console.log("视频网页信息数据有错误");
            }

        } catch (e) {
            console.error("视频网页信息请求失败");
            console.error(e)
        }

    }

    async function saveBVInfo(res) {
        if (res?.data) {
            console.log('2///////////////////////////////////////////////////////');
            console.log("视频相关信息保存中......");
            const dom = new JSDOM(res.data)
            const document = dom.window.document;

            //标题
            const title = document.title;

            //作者
            const authorTag = document.querySelector('meta[data-vue-meta="true"][itemprop="author"][name="author"]');
            const author = authorTag ? authorTag.getAttribute('content') : null;

            //上传时间
            const timeTag = document.querySelector('meta[data-vue-meta="true"][itemprop="datePublished"]');
            const publishTime = timeTag ? timeTag.getAttribute('content') : null;

            //观看量
            const viewTextNodes = document.querySelectorAll('.view-text');
            let viewText = null;
            if (viewTextNodes?.length > 0) {
                viewText = viewTextNodes[0].textContent;
            }

            //关键字标签
            const tagLinks = document.querySelectorAll('.tag-link');
            const tags = [];
            tagLinks.forEach(link => {
                const text = link.textContent;
                tags.push(text);
            });

            const scripts = document.querySelectorAll("script");
            let videoUrl = null, audioUrl = null;
            if (scripts?.length > 3) {
                const playInfoString = scripts[3].textContent.replace('window.__playinfo__=', '');
                const playInfo = JSON.parse(playInfoString)
                //视频url
                videoUrl = playInfo.data?.dash.video[0].baseUrl;

                //音频url
                audioUrl = playInfo.data?.dash.audio[0].baseUrl;
            }

            const infoObj = {
                title, author, publishTime, viewText, 'tags': tags, videoUrl, audioUrl,
            }
            if (!videoUrl) {
                console.error('videoUrl error')
            }
            if (!audioUrl) {
                console.error('audioUrl error')
            }

            const infoFunc = () => {
                console.log("视频相关信息已保存");
            }
            const errorInfoFunc = () => {
                console.error("视频相关信息保存失败");
            }
            await saveFile(infoFileUrl, JSON.stringify(infoObj), infoFunc, errorInfoFunc);

            return infoObj
        } else {
            console.log("视频网页信息数据有错误");
        }

    }

    async function getBVVideo(videoUrl) {
        console.log('3///////////////////////////////////////////////////////')
        try {
            if (!isVideoExists) {
                console.log("视频内容请求中......");
                const videoData = await axios({
                    url: videoUrl, responseType: 'arraybuffer', method: 'get', headers: {
                        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                        "Referer": "https://search.bilibili.com/all?keyword=%E4%B8%80%E4%B8%AA%E8%B6%85%E7%9F%AD%E7%9A%84%E8%A7%86%E9%A2%91&from_source=webtop_search&spm_id_from=333.1007&search_source=5",
                    }
                })
                console.log("视频内容请求完毕");

                console.log("视频文件保存中......");
                const infoFunc = () => {
                    console.log("视频文件已保存");
                }
                const errorInfoFunc = () => {
                    console.error("视频文件保存失败");
                }
                await saveFile(videoFileUrl, videoData.data, infoFunc, errorInfoFunc);
            } else {
                console.log("视频内容已存在");
            }
        } catch (e) {
            console.error("视频内容请求失败");
        }
    }

    async function getBVAudio(audioUrl) {
        console.log('4///////////////////////////////////////////////////////')
        try {
            if (!isAudioExists) {
                console.log("音频内容请求中......");
                const audioData = await axios({
                    url: audioUrl, responseType: 'arraybuffer', method: 'get', headers: {
                        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                        "Referer": "https://search.bilibili.com/all?keyword=%E4%B8%80%E4%B8%AA%E8%B6%85%E7%9F%AD%E7%9A%84%E8%A7%86%E9%A2%91&from_source=webtop_search&spm_id_from=333.1007&search_source=5",
                    }
                })
                console.log("音频内容请求完毕");

                console.log("音频文件保存中......");

                const infoFunc = () => {
                    console.log("音频文件已保存");
                }
                const errorInfoFunc = () => {
                    console.error("音频文件保存失败");
                }
                await saveFile(audioFileUrl, audioData.data, infoFunc, errorInfoFunc);

            } else {
                console.log("音频内容已存在");
            }
        } catch (e) {
            console.error("视频内容保存失败");
        }
    }
}

const keyWordSearch = async (keyWord) => {
    const url = `https://search.bilibili.com/all?keyword=${keyWord}&from_source=webtop_search&spm_id_from=333.788&search_source=5&order=click&pubtime_begin_s=1720886400&pubtime_end_s=1736438399`
    try {
        const res = await axios.get(url);
        const dataString = typeof res.data === 'string' ? res.data : JSON.stringify(res.data); // 确保是字符串
        const regex = /bvid:"(BV[A-Za-z0-9]{10})"/g;
        let match;
        const BVIdList = [];
        while ((match = regex.exec(dataString)) !== null) {
            BVIdList.push(match[1]); // match[1] 是捕获组中的内容，即BV号
        }
        console.log('BVIdList num:', BVIdList.length)
        const dirPath = path.resolve(__dirname, '../saveFile');
        await createDirectory(dirPath);

        const BVIdListFilePath = path.resolve(dirPath, 'BVIdList.json');
        console.log("搜索词相关的所有BVId保存中......");
        const infoFunc = () => {
            console.log("所有BVId文件已保存");
        }
        const errorInfoFunc = () => {
            console.error("所有BVId文件保存失败");
        }
        await saveFile(BVIdListFilePath, JSON.stringify(BVIdList), infoFunc, errorInfoFunc);

        for (const BVId of BVIdList.slice(5, 10)) {
            await saveBV(BVId)
        }
        console.log('操作结束')
    } catch (err) {
        console.error('Error during keyword search:', err);

    }
}

const margeBV = async (BVId) => {
    console.log('')
    console.log(BVId + '开始合成')
    const videoFilePath = path.resolve(dirPath, BVId, `${BVId}.mp4`);
    const audioFilePath = path.resolve(dirPath, BVId, `${BVId}.mp3`);
    const outputFilePath = path.resolve(dirPath, BVId, `${BVId}-marge.mp4`);
    if (!fs.existsSync(outputFilePath)) {
        // 检查输入文件是否存在
        if (!fs.existsSync(videoFilePath)) {
            console.error('视频文件不存在，请检查文件路径。');
        } else if (!fs.existsSync(audioFilePath)) {
            console.error('音频文件不存在，请检查文件路径。');
        } else {
            const ffmpegCommand = `${ffmpeg}  -i ${videoFilePath} -i ${audioFilePath} -c:v copy -c:a aac -strict experimental -map 0:v:0 -map 1:a:0 ${outputFilePath}`
            // console.log('')
            console.log('合成视频文件生成中......')
            try {
                execSync(ffmpegCommand)
            } catch (e) {
                console.error('合成视频生成失败')
                console.error(e)
            }
            console.log(BVId + '结束合成')
        }
    } else {
        console.log('合成视频已经存在')
        console.log(BVId + '结束合成')
    }

}

const canMargeBVIds = [];
const BVIdObj = {};

const traverseDirectoryAsync = async (dir) => {
    try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stats = fs.statSync(fullPath);
            if (stats.isDirectory()) {
                //是文件夹
                // console.log(`Directory: ${fullPath}`);
                await traverseDirectoryAsync(fullPath);
            } else if (stats.isFile()) {
                const extName = path.extname(fullPath);
                const fileNameWithoutExt = path.basename(fullPath, extName);
                //是文件
                if (!Reflect.has(BVIdObj, fileNameWithoutExt)) {
                    Reflect.set(BVIdObj, fileNameWithoutExt, 0)
                }
                if (extName === '.mp4' || extName === ".mp3") {
                    BVIdObj[fileNameWithoutExt]++;
                }
                if (BVIdObj[fileNameWithoutExt] === 2) {
                    canMargeBVIds.push(fileNameWithoutExt)
                }
                // await margeAudioAndVideo(file)
                // console.log(`File: ${fullPath}`);
            }
        }
    } catch (err) {
        console.error(`Unable to scan directory: ${err}`);
    }
}

const margeAllBV = async () => {
    console.log('开始合并')
    await traverseDirectoryAsync(dirPath);
    for (const BVId of canMargeBVIds) {
        await margeBV(BVId)
    }
    console.log('结束合并')
}

async function createDirectory(dirPath) {
    fs.mkdir(dirPath, {recursive: true}, (err) => {
        if (err) {
            if (err.code === 'EEXIST') {
                // 文件夹已存在
                console.log(`The directory already exists: ${dirPath}`);
            } else {
                // 其他错误
                console.error(`Error creating directory: ${err.message}`);
            }
        } else {
            // 文件夹成功创建
            // console.log(`Directory created successfully: ${dirPath}`);
        }
    });
}

async function saveFile(path, data, info, errInfo) {
    try {
        fs.writeFileSync(path, data);
        info();
    } catch (e) {
        errInfo();
        console.error(e)
    }
}

module.exports = {
    saveBV, keyWordSearch, margeBV, margeAllBV
}
