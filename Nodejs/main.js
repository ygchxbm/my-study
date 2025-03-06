var number = (function(){
    let num = 1
    function add() {
        num++
    }
    function get() {
        return num
    }
    return {
        num,
        add,
        get,
    }
})()
//1
console.log(number.num)

number.add()
//1
console.log(number.num)

console.log(number.get())
