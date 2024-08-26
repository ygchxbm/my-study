const b1: Promise<string> = new Promise((resolve, reject) => {
    console.log('b1');
    setTimeout(() => {
        console.log('b111');
        resolve('b1 res')
    })
})

const b2: Promise<string> = new Promise((resolve, reject) => {
    console.log('b1');
    setTimeout(() => {
        console.log('b222');
        resolve('b2 res')
    })
})
let res: string[] = Promise.all([b1, b2]).then((result: string[]) => {
    console.log(result);
    return result
})
window.b = {b1};
