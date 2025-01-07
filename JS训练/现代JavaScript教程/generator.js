//迭代器
function* generateSequence() {
    yield 1;
    yield 2;
    return 3;
}

let generator = generateSequence();

let one = generator.next();
console.log(one.value)

for (let value of generator) {
    console.log(value); // 1，然后是 2
}


function* generateSequence2(start, end) {
    for (let i = start; i <= end; i++) yield i;
}

function* generatePasswordCodes() {

    // 0..9
    yield* generateSequence2(48, 57);

    // A..Z
    yield* generateSequence2(65, 90);

    // a..z
    yield* generateSequence2(97, 122);

}

let str = '';

for(let code of generatePasswordCodes()) {
    str += String.fromCharCode(code);
}

console.log(str)


function* gen() {
    let ask1 = yield "2 + 2 = ?";

    console.log(ask1); // 4

    let ask2 = yield "3 * 3 = ?"

    console.log(ask2); // 9
}

let generator3 = gen();

console.log( generator3.next() ); // "2 + 2 = ?"

console.log( generator3.next(4) ); // "3 * 3 = ?"

console.log( generator3.next(9) ); // true
