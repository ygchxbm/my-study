//搜索功能
const baseRequest = require("./baseRequest");

const keyword = "功德"

function searchCreate(keyword) {
    const url = `/v1/search/create`;
    const methods = "post";
    const params = {
        keyword,
        type:"ALL",
        sourcePageName:4,
        currentPageName:4
    };
    const func = res => {
        console.log(res.status)
        console.log(res.data.data)
        console.log(res.data.highlightWord)
    }
    baseRequest({url, methods, params, func})
}

// searchCreate(keyword)

exports.searchCreate=searchCreate;
