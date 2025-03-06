//FileHandle，即文件句柄，是 Node.js 文件系统模块中提供的一种用于操作文件的抽象对象，是 fs.promises API 中的一个类，用于表示打开的文件
const fsPromises = require('node:fs/promises');

//1、filehandle.close()
//用于关闭文件句柄，当使用 fsPromises.open() 打开文件时，会返回一个 FileHandle 实例。在完成文件操作（如读取、写入等）后，需要使用 filehandle.close() 方法关闭文件，以便释放系统资源，防止文件损坏和数据丢失。
// (async (path) => {
//     let filehandle;
//     try {
//         filehandle = await fsPromises.open(path)
//     } catch (e) {
//         console.error('发生异常', e)
//     } finally {
//         await filehandle?.close()
//         console.log('文件句柄成功关闭')
//     }
// })('./assets/name.txt')


//2、filehandle.writeFile(data, options)
//用于异步地将数据写入文件。
//
//如果文件已经存在，则替换该文件。
//如果文件不存在，自动创建一个新的文件并将数据写入该文件中。
//如果文件路径所在的目录不存在，将返回一个错误，需要先手动创建它所在的目录。
//
//注意⚠：在 Promise 解析（或拒绝）之前多次使用 filehandle.writeFile() 写入同一文件是不安全的。如果在一个文件上调用了一个或多个 filehandle.write() 方法，然后再调用 filehandle.writeFile() 方法，那么数据将从当前位置写入到文件末尾，它并不总是从文件开头开始写入。

// (async (path) => {
//     let filehandle;
//     try {
//         filehandle = await fsPromises.open(path, 'w')
//         await filehandle.writeFile(`麻6${Date.now()}`, 'utf8')
//         console.log('数据已被成功写入')
//     } catch (e) {
//         console.error('发生异常', e)
//     } finally {
//         await filehandle?.close()
//         console.log('文件句柄成功关闭')
//     }
// })('./assets/name.txt')


//3、filehandle.appendFile(data[, options])
//当在文件句柄上进行操作时，则无法将模式更改为使用 fsPromises.open() 设置的模式。因此，这相当于 filehandle.writeFile()。
//filehandle.writeFile() 的别名


//4、filehandle.createReadStream([options])
//用于从文件中读取数据并生成一个可读流，这个方法允许你以流的方式读取文件，而不是一次性将整个文件读入内存。这种方式常用来处理大型文件，它可以减少内存占用并提高程序的效率。
//该方法返回一个可读流实例，可以通过监听 data、error 和 end 事件来处理流中的数据。

// (async (path) => {
//     let filehandle;
//     try {
//         filehandle = await fsPromises.open(path)
//         const readStream = filehandle.createReadStream()
//         readStream.on('data', chunk => {
//             console.log(chunk.toString())
//         })
//         readStream.on('error', err => {
//             console.error('读取错误：', err)
//         })
//         readStream.on('end', () => {
//             console.log('读取完毕')
//         })
//     } catch (e) {
//         console.error('发生异常', e)
//     } finally {
//         await filehandle?.close()
//         console.log('文件句柄成功关闭')
//     }
// })('./assets/name.txt')


(async (path) => {
    let filehandle;
    try {
        filehandle = await fsPromises.open(path)
        const writeStream = filehandle.createWriteStream({start:0})
        writeStream.write('Hello, world!\n');
        writeStream.write('This is an example.\n');
        writeStream.end('Goodbye, world!');

        writeStream.on('finish', () => {
            console.log('写入完毕');
        });

        writeStream.on('error', (err) => {
            console.error('写入出错：', err);
        });

        writeStream.on('close', () => {
            console.log('可写流关闭');
        });
    } catch (e) {
        console.error('发生异常', e)
    } finally {
        await filehandle?.close()
        console.log('文件句柄成功关闭')
    }
})('./assets/name.txt')
