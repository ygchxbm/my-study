const path = require("node:path");
const {readdir, readFile, writeFile} = require("node:fs/promises");

const dirPath = path.join(__dirname, '../saveFile/heroes/千珏');

const createIncompleteBVJSON = async (dirPath) => {
    const incompleteBVIdList = [];
    const promiseList = [];
    try {
        const files = await readdir(dirPath, {withFileTypes: true});
        for (const file of files) {
            const BVsPath = path.join(file.path, file.name);
            if (file.isDirectory() && file.name === 'BVs') {
                const BVFiles = await readdir(BVsPath, {withFileTypes: true});
                for (const BVFile of BVFiles) {
                    if (BVFile.isDirectory()) {
                        const BVPath = path.join(BVFile.path, BVFile.name);
                        promiseList.push(readdir(BVPath, {withFileTypes: true}).then(res => {
                            if (res.length !== 4) {
                                incompleteBVIdList.push(BVFile.name)
                            }
                        }))

                    }
                }
                await Promise.all(promiseList);
                if (incompleteBVIdList.length > 0) {
                    const incompleteFilePath = path.join(dirPath, 'incompleteBV.json')
                    await writeFile(incompleteFilePath, JSON.stringify(incompleteBVIdList), {encoding: "utf-8"})
                    console.log(incompleteFilePath)
                    console.log(incompleteBVIdList.length)
                    console.log('')
                }
            }
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
                createIncompleteBVJSON(dirPath).then(r => {
                })
            }
        }
    }).catch(e => {
        console.error(e)
    });

}
// createIncompleteBVJSON(dirPath)

main()
