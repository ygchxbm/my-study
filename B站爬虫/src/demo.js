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


const BVId = 'BV1GU4y1p7j1';

// BVIdInfo(BVId)

async function BVIdInfo(BVId) {
    const url = `https://www.bilibili.com/video/BV1Htr8YhELV/?spm_id_from=333.1007.tianma.1-1-1.click`
    try {
        const res = await axios({
            method: 'get',
            url: 'https://xy113x200x108x156xy2408y8770yy4y8000y27xy.mcdn.bilivideo.cn:4483/upgcxcode/55/91/422629155/422629155_nb2-1-30032.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1736277951&gen=playurlv2&os=mcdn&oi=2004602649&trid=00000f6a722ee7694cba8318d886fca84530u&mid=0&platform=pc&og=cos&upsig=3e518d06271fb68f444717919dd0a263&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform,og&mcdnid=50016471&bvc=vod&nettype=0&orderid=0,3&buvid=38F47817-0310-AC32-92C8-4724739B6C6983763infoc&build=0&f=u_0_0&agrr=0&bw=60178&logo=A0020000',
            headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                "referer": "https://search.bilibili.com/all?vt=70366269&keyword=%E7%88%AC%E8%99%ABb%E7%AB%99%E8%A7%86%E9%A2%91&from_source=webtop_search&spm_id_from=333.788&search_source=5"
            }
        })
        const dirPath = path.resolve(__dirname, '../saveFile');
        await fs.writeFileSync(path.resolve(dirPath, 'test.mp4'), res.data);
        console.log(res)
    } catch (err) {
        return err;
    }
}

// audioInfo()

async function audioInfo() {
    const url = `https://www.bilibili.com/video/BV1GU4y1p7j1/?spm_id_from=333.1007.tianma.1-1-1.click`
    try {
        const res = await axios({
            method: 'get',
            url: 'https://upos-sz-estghw.bilivideo.com/upgcxcode/42/48/303114842/303114842-1-30280.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1736279448&gen=playurlv2&os=upos&oi=2004602762&trid=8c3ffeba7f4b4d7a86a77d9a0f1b5144u&mid=0&platform=pc&og=hw&upsig=4108bed28a5f50bd372d8ae128f7936f&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform,og&bvc=vod&nettype=0&orderid=0,3&buvid=8E8842DA-1794-2021-FC7D-E3F603D56DBE38051infoc&build=0&f=u_0_0&agrr=0&bw=19736&logo=80000000',
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                "Referer": url
            },
            responseType: 'arraybuffer',
        })
        const binaryData = Buffer.from(res.data, 'binary');
        const dirPath = path.resolve(__dirname, '../saveFile');
        await fs.writeFileSync(path.resolve(dirPath, 'test.mp3'), binaryData);
        console.log(res)
    } catch (err) {
        console.log(err)
        return err;
    }
}

// VideosInfo();

async function VideosInfo() {
    const url = `https://www.bilibili.com/video/BV1GU4y1p7j1/?spm_id_from=333.1007.tianma.1-1-1.click`
    try {
        const res = await axios({
            method: 'get',
            url: 'https://upos-sz-estgoss.bilivideo.com/upgcxcode/42/48/303114842/303114842-1-100110.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1736279448&gen=playurlv2&os=upos&oi=2004602762&trid=8c3ffeba7f4b4d7a86a77d9a0f1b5144u&mid=0&platform=pc&og=cos&upsig=17a468d5d768caf07f0816d8b172e4f8&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform,og&bvc=vod&nettype=0&orderid=0,3&buvid=8E8842DA-1794-2021-FC7D-E3F603D56DBE38051infoc&build=0&f=u_0_0&agrr=0&bw=35454&logo=80000000',
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                "Referer": url
            },
            responseType: 'arraybuffer',
        })
        const binaryData = Buffer.from(res.data, 'binary');
        const dirPath = path.resolve(__dirname, '../saveFile');
        await fs.writeFileSync(path.resolve(dirPath, 'test.mp4'), binaryData);
        console.log(res)
    } catch (err) {
        console.log(err)
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

// playInfo(fileUrl)
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

getViewText(fileUrl)
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
