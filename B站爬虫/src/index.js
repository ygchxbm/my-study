const fs = require("node:fs");
const path = require("node:path");
const axios = require("axios");

const keyWord = "LoL手游教学"


async function keywordSearch(keyWord) {
    const url = `https://search.bilibili.com/video?keyword=${keyWord}&from_source=webtop_search&spm_id_from=333.1007&search_source=5&page=2&o=36`
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

        const filePath = path.resolve(dirPath, 'BVIdList.txt');
        await fs.writeFileSync(filePath, BVIdList.join('\n')); // 将数组转换为以换行符分隔的字符串
        await fs.writeFileSync(path.resolve(dirPath, 'searchInfo.html'), res.data); // 将数组转换为以换行符分隔的字符串

        return BVIdList;
    } catch (err) {
        console.error('Error during keyword search:', err);
        return false;
    }
}


const BVId = 'BV1nF411C7Rm';

const fileUrl = path.resolve(__dirname, `../saveFile/${BVId}.html`);
const {JSDOM} = require('jsdom');

// getBVInfo(BVId)
async function getBVInfo(BVId) {
    const url = `https://www.bilibili.com/video/${BVId}/?spm_id_from=333.1007.tianma.1-1-1.click`
    try {
        const res = await axios({
            method: 'get',
            url,
            // headers: {
            //     "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            //     "referer": "https://search.bilibili.com/all?vt=70366269&keyword=%E7%88%AC%E8%99%ABb%E7%AB%99%E8%A7%86%E9%A2%91&from_source=webtop_search&spm_id_from=333.788&search_source=5"
            // }
        })
        const dirPath = path.resolve(__dirname, '../saveFile');
        await fs.writeFileSync(path.resolve(dirPath, `${BVId}.html`), res.data);
        console.log(res)
    } catch (err) {
        return err;
    }
}

playInfo(fileUrl)
async function playInfo(fileUrl) {
    const res = await fs.readFileSync(fileUrl, 'utf-8')
    const dom = new JSDOM(res)
    const document = dom.window.document;

// 获取所有的 script 标签
    const scripts = document.querySelectorAll("script");
    const playInfoString = scripts[3].textContent.replace('window.__playinfo__=', '');
    const dirPath = path.resolve(__dirname, '../saveFile');
    const playInfo = JSON.parse(playInfoString);
    await fs.writeFileSync(path.resolve(dirPath, `${fileUrl.split('.')[0]}-playInfo.json`), playInfoString)
    return playInfo
}


const InfoUrl = path.resolve(__dirname, `../saveFile/${BVId}-playInfo.json`);
const videoFileUrl = path.resolve(__dirname, `../saveFile/${BVId}.mp4`);
const audioFileUrl = path.resolve(__dirname, `../saveFile/${BVId}.mp3`);

// getVideoUrl(InfoUrl);

async function getVideoUrl(InfoUrl) {
    const resStr = fs.readFileSync(InfoUrl, 'utf-8');
    const res = JSON.parse(resStr);
    const videoUrl = res.data.dash.video[0].baseUrl;
    console.log(videoUrl)
    const videoData = await axios({
        url: 'https://upos-sz-estgoss.bilivideo.com/upgcxcode/42/48/303114842/303114842-1-100110.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1736329954&gen=playurlv2&os=upos&oi=3071155562&trid=87d8fd6d59174e94822bc3fed51ceedcu&mid=0&platform=pc&og=cos&upsig=b893bc0222718e6d21dc6cf2588b69d2&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform,og&bvc=vod&nettype=0&orderid=0,3&buvid=&build=0&f=u_0_0&agrr=1&bw=35454&logo=80000000',
        responseType: 'arraybuffer',
        method: 'get',
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            "Referer": "https://search.bilibili.com/all?keyword=%E4%B8%80%E4%B8%AA%E8%B6%85%E7%9F%AD%E7%9A%84%E8%A7%86%E9%A2%91&from_source=webtop_search&spm_id_from=333.1007&search_source=5",
        }
    })
    fs.writeFileSync(videoFileUrl, videoData.data);
}

// getAudioUrl(InfoUrl)

async function getAudioUrl(InfoUrl) {
    const resStr = fs.readFileSync(InfoUrl, 'utf-8');
    const res = JSON.parse(resStr);
    const videoUrl = res.data.dash.video[0].baseUrl;
    console.log(videoUrl)
    const videoData = await axios({
        url: 'https://upos-sz-estgoss.bilivideo.com/upgcxcode/42/48/303114842/303114842-1-100110.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1736329954&gen=playurlv2&os=upos&oi=3071155562&trid=87d8fd6d59174e94822bc3fed51ceedcu&mid=0&platform=pc&og=cos&upsig=b893bc0222718e6d21dc6cf2588b69d2&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform,og&bvc=vod&nettype=0&orderid=0,3&buvid=&build=0&f=u_0_0&agrr=1&bw=35454&logo=80000000',
        responseType: 'arraybuffer',
        method: 'get',
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            "Referer": "https://search.bilibili.com/all?keyword=%E4%B8%80%E4%B8%AA%E8%B6%85%E7%9F%AD%E7%9A%84%E8%A7%86%E9%A2%91&from_source=webtop_search&spm_id_from=333.1007&search_source=5",
        }
    })
    fs.writeFileSync(audioFileUrl, videoData.data);
}

// getTitle(fileUrl)
async function getTitle(fileUrl) {
    const res = await fs.readFileSync(fileUrl, 'utf-8')
    const dom = new JSDOM(res)
    const document = dom.window.document;

    const title = document.title;
    console.log(title)
}

// getKeywords(fileUrl)
async function getKeywords(fileUrl) {
    const res = await fs.readFileSync(fileUrl, 'utf-8')
    const dom = new JSDOM(res)
    const document = dom.window.document;

    // 使用 querySelectorAll 查询所有具有 class="tag-link" 的 <a> 标签
    const tagLinks = document.querySelectorAll('.tag-link');

    // 遍历查询结果并提取文本内容
    const tags = [];
    tagLinks.forEach(link => {
        const text = link.textContent;
        tags.push(text);
    });
    console.log(tags)
}

// getAuthor(fileUrl)
async function getAuthor(fileUrl) {
    const res = await fs.readFileSync(fileUrl, 'utf-8')
    const dom = new JSDOM(res)
    const document = dom.window.document;

    // 查询具有特定属性的 <meta> 标签
    const metaTag = document.querySelector('meta[data-vue-meta="true"][itemprop="author"][name="author"]');

// 提取 content 属性值
    const author = metaTag ? metaTag.getAttribute('content') : null;

    console.log(author); // 输出: 七刀社-全员吹
}

// getPublishTime(fileUrl)
async function getPublishTime(fileUrl) {
    const res = await fs.readFileSync(fileUrl, 'utf-8')
    const dom = new JSDOM(res)
    const document = dom.window.document;

    // 查询具有特定属性的 <meta> 标签
    const metaTag = document.querySelector('meta[data-vue-meta="true"][itemprop="datePublished"]');

// 提取 content 属性值
    const publishTime = metaTag ? metaTag.getAttribute('content') : null;

    console.log(publishTime); // 输出: 七刀社-全员吹
}

// getViewText(fileUrl)
async function getViewText(fileUrl) {
    const res = await fs.readFileSync(fileUrl, 'utf-8')
    const dom = new JSDOM(res)
    const document = dom.window.document;

    // 查询具有特定属性的 <meta> 标签
    const viewTextNodes = document.querySelectorAll('.view-text');

    // 遍历查询结果并提取文本内容
    const viewTexts = [];
    viewTextNodes.forEach(viewText => {
        const text = viewText.textContent;
        viewTexts.push(text);
    });
    console.log(viewTexts)

}

// main();

async function main() {
    const BVId = 'BV1nF411C7Rm';
    const dirPath = path.resolve(__dirname, '../saveFile');
    await createDirectory(dirPath);

    const videoFileUrl = path.resolve(__dirname, `../saveFile/${BVId}.mp4`);
    const audioFileUrl = path.resolve(__dirname, `../saveFile/${BVId}.mp3`);
    const url = `https://www.bilibili.com/video/${BVId}/?spm_id_from=333.1007.search-card.all.click`
    try {
        console.log("视频网页信息请求中......");
        const res = await axios({
            method: 'get',
            url,
        })
        console.log("视频网页信息请求完毕");
        // const dirPath = path.resolve(__dirname, '../saveFile');
        // await fs.writeFileSync(path.resolve(dirPath, `${BVId}.html`), res.data);

        console.log('1///////////////////////////////////////////////////////')

        console.log('视频相关信息（标题、作者、发布日期、观看量、关键字标签）获取中......')
        const dom = new JSDOM(res.data)
        const document = dom.window.document;
        const title = document.title;
        console.log('title:',title);

        const authorTag = document.querySelector('meta[data-vue-meta="true"][itemprop="author"][name="author"]');
        const author = authorTag ? authorTag.getAttribute('content') : null;
        console.log('author:',author);

        const timeTag = document.querySelector('meta[data-vue-meta="true"][itemprop="datePublished"]');
        const publishTime = timeTag ? timeTag.getAttribute('content') : null;
        console.log('publishTime:',publishTime);

        const viewTextNodes = document.querySelectorAll('.view-text');
        const viewTexts = [];
        viewTextNodes.forEach(viewText => {
            const text = viewText.textContent;
            viewTexts.push(text);
        });
        console.log('viewTexts:',viewTexts);

        const tagLinks = document.querySelectorAll('.tag-link');
        const tags = [];
        tagLinks.forEach(link => {
            const text = link.textContent;
            tags.push(text);
        });
        console.log('tags:',tags);

        console.log('视频相关信息（标题、作者、发布日期、观看量、关键字标签）获取完毕')



        console.log('2///////////////////////////////////////////////////////')
        console.log("视频地址解析中......");
        const scripts = document.querySelectorAll("script");
        const playInfoString = scripts[3].textContent.replace('window.__playinfo__=', '');
        const playInfo=JSON.parse(playInfoString)
        const videoUrl = playInfo.data.dash.video[0].baseUrl;
        console.log("视频地址解析完毕");
        console.log("视频内容请求中......");
        const videoData = await axios({
            url:videoUrl,
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



        console.log('3///////////////////////////////////////////////////////')
        console.log("音频地址解析中......");
        const audioUrl = playInfo.data.dash.audio[0].baseUrl;
        console.log("音频地址解析完毕");
        console.log("音频内容请求中......");
        const audioData = await axios({
            url:audioUrl,
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
    } catch (err) {
        return err;
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
            console.log(`Directory created successfully: ${dirPath}`);
        }
    });
}

