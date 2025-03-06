const path = require("node:path");
const fs = require("fs");
const {readdir, readFile, writeFile} = require("node:fs/promises");



const deleteFolderRecursive = (folderPath) => {
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach(file => {
            const curPath = path.join(folderPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                // 如果是文件夹，递归删除
                deleteFolderRecursive(curPath);
            } else {
                // 如果是文件，删除
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(folderPath);
    } else {
        console.log(`Folder ${folderPath} does not exist`);
    }
}

const removeIncompleteBVJSON = async (dirPath) => {
    let BVIdList = [];
    let incompleteBVIdList = [];
    let saveJsonPath;
    let incompleteBVPath;
    try {
        const files = await readdir(dirPath, {withFileTypes: true});
        if (files.length > 1) {
            const baseName = path.basename(dirPath);
            for (const file of files) {
                const sonPath = path.join(file.path, file.name);
                if (file.isFile()) {
                    if (file.name === baseName + '.json') {
                        saveJsonPath = sonPath
                        const dataString = await readFile(sonPath);
                        BVIdList = JSON.parse(dataString);
                    } else if (file.name === 'incompleteBV.json') {
                        incompleteBVPath = sonPath
                        const dataString = await readFile(sonPath);
                        incompleteBVIdList = JSON.parse(dataString);
                    }
                }
            }
            if (incompleteBVIdList?.length > 0) {
                for (const incompleteBVId of incompleteBVIdList) {
                    const removePath = path.join(dirPath, "BVS", incompleteBVId)
                    console.log(removePath)
                    deleteFolderRecursive(removePath)
                }

                BVIdList = BVIdList.filter(item => {
                    return incompleteBVIdList.indexOf(item) === -1;
                })
                await writeFile(saveJsonPath, JSON.stringify(BVIdList), {encoding: "utf-8"});
                fs.unlinkSync(incompleteBVPath)
            }
            console.log('')
        }
    } catch (e) {
        console.log('error', dirPath)
        console.error(e)
    }
}


const main = () => {
    const rPath = path.join(__dirname, '../saveFile/heroes')
    readdir(rPath, {withFileTypes: true}).then(files => {
        for (const file of files) {
            if (file.isDirectory()) {
                const dirPath = path.join(file.path, file.name);
                removeIncompleteBVJSON(dirPath).then(r => {
                })
            }
        }
    }).catch(e => {
        console.error(e)
    });

}

const dirPath = path.join(__dirname, '../saveFile/heroes/卡莎');
// removeIncompleteBVJSON(dirPath)

main()
