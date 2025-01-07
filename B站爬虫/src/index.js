const fs = require("node:fs");
const path = require("node:path");
const axios = require("axios");

const keyWord = "LoL手游教学"

// main()

async function main() {
    // const BVIdList = await keywordSearch(keyWord);
    // if (BVIdList && BVIdList.length > 0) {
    // for (const BVId of BVIdList) {
    await BVIdInfo()
    // }
    // }
    // console.log(BVIdList)
}


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
        const binaryData = Buffer.from(res.data,'binary');
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
        const binaryData = Buffer.from(res.data,'binary');
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
