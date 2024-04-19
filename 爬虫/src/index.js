const fs = require("fs");
const api = require('./xiaoyuzhou/index');

async function main() {
    const categoryRes = await api.listAll();
    // console.log(categoryRes.data.data)
    const categoryIds = categoryRes.data.data.map(item => item.id);
    // console.log(categoryIds)
    const podcastIds = [];

    async function getAllPodcast(categoryId, loadMoreKey) {
        let listByTabRes = await api.listByTab(categoryId, "ALL", loadMoreKey)
        listByTabRes.data.data.forEach(item => {
            podcastIds.push(item.podcast.pid);
        })
        if (listByTabRes.data.loadMoreKey) {
            await getAllPodcast(categoryId, listByTabRes.data.loadMoreKey)
        }

        return podcastIds.length
    }

    async function accessArray(array){
        for (const arrayElement of array) {
            await getAllPodcast(arrayElement,0)
            // console.log(podcastIds.length)
        }
    }

    const filePath = 'podcastId.json';
    await accessArray(categoryIds).then(res=>{
        console.log(podcastIds.length)
        const jsonString=JSON.stringify(podcastIds)
        fs.writeFile(filePath, jsonString, (err) => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log('Successfully wrote string to JSON file:', filePath);
            }
        });
    })
}

main().then(res => {
    // console.log(res)
    // console.log(123)
    console.log('main end')
}).catch(err => {
    console.log(err)
})
