let num = 1
function add() {
    num++
}
module.exports.num = num
module.exports.add = add
module.exports.get = ()=>{
    return num
}
