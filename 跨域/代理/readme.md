index.html是从clientServe服务请求而来，当它要访问serve下的api时，由于浏览器与服务器之间的同源策略，他们端口号不同，不能直接 请求，所以先请求clientServe，再clientServe请求serve，clientServe得到结果后再返回给页面。
