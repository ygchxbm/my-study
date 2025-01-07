//可迭代对象

let range = {
    from: 1,
    to: 5,

    [Symbol.iterator]() {
        return {
            current: this.from,
            last: this.to,
            next: function () {
                return this.current <= this.last ? {value: this.current++, done: false} : {value: this.last, done: true};
            }
        }
    }
};


for (let num of range) {
    console.log(num); // 1, 然后是 2, 3, 4, 5
}
