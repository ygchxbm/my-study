const fs = require('fs')

const oldData = fs.readFileSync('./downloaded_xiaoyuzhou.txt', 'utf-8').split(/\r?\n/);
// console.log(oldData.length)

const newData = require('./podcastId.json');
// console.log(newData.length);

const myNeed = [];
const elseNeed = [];

newData.forEach(item => {
    if (!oldData.includes(item)) {
        myNeed.push(item)
    }
})

oldData.forEach(item => {
    if (!newData.includes(item)) {
        elseNeed.push(item)
    }
})


fs.writeFile('./myNeed.json', JSON.stringify(myNeed), (err) => {
    if (err) {
        console.error('Error writing file:', err);
    } else {
        console.log('Successfully');
    }
});

fs.writeFile('./elseNeed.json', JSON.stringify(elseNeed), (err) => {
    if (err) {
        console.error('Error writing file:', err);
    } else {
        console.log('Successfully');
    }
});

console.log("myNeed", myNeed.length);
console.log("elseNeed", elseNeed.length)
