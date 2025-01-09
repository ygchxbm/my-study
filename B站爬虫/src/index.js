const fs = require("node:fs");
const path = require("node:path");
const axios = require("axios");
const {JSDOM} = require("jsdom");

const keyWord = "英雄联盟手游盖伦教学"
keyWordSearch(keyWord)

async function keyWordSearch(keyWord) {
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

        const dirPath = path.resolve(__dirname, '../saveFile');
        await createDirectory(dirPath);

        const filePath = path.resolve(dirPath, 'BVIdList.json');
        await fs.writeFileSync(filePath, JSON.stringify(BVIdList)); // 将数组转换为以换行符分隔的字符串
        // const filePath = path.resolve(dirPath, 'keyWordSearchResult.json');
        // const keyWordSearchResultObj = {
        //     keyWord,
        //     'BVIdList': BVIdList
        // }
        // await fs.writeFileSync(filePath, JSON.stringify(keyWordSearchResultObj)); // 将数组转换为以换行符分隔的字符串
        for (const BVId of BVIdList) {
            await saveBV(BVId)
        }
        console.log('操作结束')

    } catch (err) {
        console.error('Error during keyword search:', err);
        return false;
    }
}


const BVId = 'BV1cp4y1g7ug'

// saveBV(BVId)

async function saveBV(BVId) {
    console.log('')
    if (!BVId) {
        console.error('BVId不存在！')
    }
    console.log(`${BVId}开始`)
    const dirPath = path.resolve(__dirname, `../saveFile/BVs/${BVId}`);
    const infoFileUrl = path.resolve(dirPath, `${BVId}.json`);
    const videoFileUrl = path.resolve(dirPath, `${BVId}.mp4`);
    const audioFileUrl = path.resolve(dirPath, `${BVId}.mp3`);
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
        const url = `https://www.bilibili.com/video/${BVId}/?spm_id_from=333.337.search-card.all.click`;

        console.log('1///////////////////////////////////////////////////////')
        try {
            console.log("视频网页信息请求中......");

            const res = await axios({
                method: 'get',
                url,
            })
            console.log("视频网页信息请求完毕");

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
                videoUrl = playInfo.data.dash.video[0].baseUrl;

                //音频url
                audioUrl = playInfo.data.dash.audio[0].baseUrl;
            }

            const infoObj = {
                title,
                author,
                publishTime,
                viewText,
                'tags': tags,
                videoUrl,
                audioUrl,
            }
            try {
                fs.writeFileSync(infoFileUrl, JSON.stringify(infoObj));
                console.log("视频相关信息已保存");


                console.log('3///////////////////////////////////////////////////////')
                try {
                    if (!isVideoExists) {
                        console.log("视频内容请求中......");
                        const videoData = await axios({
                            url: videoUrl,
                            responseType: 'arraybuffer',
                            method: 'get',
                            headers: {
                                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                                "Referer": "https://search.bilibili.com/all?keyword=%E4%B8%80%E4%B8%AA%E8%B6%85%E7%9F%AD%E7%9A%84%E8%A7%86%E9%A2%91&from_source=webtop_search&spm_id_from=333.1007&search_source=5",
                            }
                        })
                        console.log("视频内容请求完毕");
                        console.log("视频文件保存中......");
                        fs.writeFileSync(videoFileUrl, videoData.data);
                        console.log("视频内容保存完毕");
                    } else {
                        console.log("视频内容已存在");
                    }
                } catch (e) {
                    console.error("视频内容保存失败");
                }

                console.log('4///////////////////////////////////////////////////////')
                try {
                    if (!isAudioExists) {
                        console.log("音频内容请求中......");
                        const audioData = await axios({
                            url: audioUrl,
                            responseType: 'arraybuffer',
                            method: 'get',
                            headers: {
                                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                                "Referer": "https://search.bilibili.com/all?keyword=%E4%B8%80%E4%B8%AA%E8%B6%85%E7%9F%AD%E7%9A%84%E8%A7%86%E9%A2%91&from_source=webtop_search&spm_id_from=333.1007&search_source=5",
                            }
                        })
                        console.log("音频内容请求完毕");
                        console.log("音频文件保存中......");
                        fs.writeFileSync(audioFileUrl, audioData.data);
                        console.log("音频内容保存完毕");
                    } else {
                        console.log("音频内容已存在");
                    }
                } catch (e) {
                    console.error("视频内容保存失败");
                }
            } catch (e) {
                console.error("视频相关信息保存失败");
            }
        } catch
            (err) {
            console.log("视频网页信息请求失败");
        }
    } else {
        console.log("视频所有信息已存在");
    }

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
