const fs = require("node:fs");
const path = require("node:path");
const axios = require("axios");

const keyWord = "LoL手游教学"

main()

async function main() {
    keywordSearch(keyWord)
}


async function keywordSearch(keyWord) {
    const url = `https://search.bilibili.com/video?keyword=${keyWord}&from_source=webtop_search&spm_id_from=333.1007&search_source=5&page=2&o=36`
    try {
        const res = await axios({
            method: 'get',
            url,
        })

        return new Promise(async (resolve, reject) => {
            const dirPath = path.resolve(__dirname, '../saveFile');
            await createDir(dirPath);
            const filePath = path.resolve(dirPath, 'list.html');
            const writer = fs.createWriteStream(filePath);
            writer.write(res.data);
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
        return false
    }
}


async function createDir(dirPath) {
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
