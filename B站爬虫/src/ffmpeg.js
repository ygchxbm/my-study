const fs = require('fs');
const path = require('path');
const {exec} = require('child_process');
const ffmpeg = require('ffmpeg-static');


const dirPath = path.resolve(__dirname, `../saveFile/BVs`)
const canMargeBVIds = [];
const BVIdObj = {};

async function traverseDirectoryAsync(dir) {
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


// traverseDirectoryAsync(dirPath).catch(console.error);
getMargeBVIds()

async function getMargeBVIds() {
    console.log('开始合并')
    await traverseDirectoryAsync(dirPath);
    for (const BVId of canMargeBVIds) {
        await margeAudioAndVideo(BVId)
    }
    console.log('结束合并')
}

async function margeAudioAndVideo(BVId) {
    const videoFilePath = path.resolve(dirPath, BVId, `${BVId}.mp4`);
    const audioFilePath = path.resolve(dirPath, BVId, `${BVId}.mp3`);
    const outputFilePath = path.resolve(dirPath, BVId, `${BVId}-marge.mp4`);
    if (!fs.existsSync(outputFilePath)) {
        // 检查输入文件是否存在
        if (!fs.existsSync(videoFilePath) || !fs.existsSync(audioFilePath)) {
            console.error('输入文件不存在，请检查文件路径。');
            process.exit(1);
        }
        const ffmpegCommand = `${ffmpeg}  -i ${videoFilePath} -i ${audioFilePath} -c:v copy -c:a aac -strict experimental -map 0:v:0 -map 1:a:0 ${outputFilePath}`
        // console.log('')
        // console.log(BVId+'开始合成')
        exec(ffmpegCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`执行错误: ${error}`);
                return;
            }
            if (stderr) {
                // console.warn(`标准错误输出: ${stderr}`);
                // 注意：stderr 有内容不一定意味着命令失败，FFmpeg 有时会将日志信息输出到 stderr
            }
            // console.log(`标准输出: ${stdout}`);
            console.log(BVId+'文件合并完成！');
        })
    } else {
        // console.log('合成视频已经存在')
    }
}
