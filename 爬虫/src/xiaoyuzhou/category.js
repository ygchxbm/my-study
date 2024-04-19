//播客种类
const baseRequest = require("./baseRequest");

const categoryId = "63c76a8924b1622727bd3219";
const tab = "ALL"

//获取所有分类
function listAll() {
    const url = "/v1/category/list-all";
    const methods = "post";
    const params = {};
    return baseRequest({url, methods, params})
}

//获取所有tab
function listTabs(categoryId) {
    const url = "/v1/category/podcast/list-tabs";
    const methods = "post";
    const params = {categoryId};
    return baseRequest({url, methods, params})
}

//获取一个分类在特定tab下的所有的播客，结果等于getPodcast(podcastId)
function listByTab(categoryId, tab,loadMoreKey) {
    const url = "/v1/category/podcast/list-by-tab";
    const methods = "post";
    const params = {categoryId, tab, omitSubscribed: false,loadMoreKey};
    return baseRequest({url, methods, params})
}

// listAll().then(res => {
//     console.log(res.status)
// }).catch(err => {
//     console.log(err.code)
// });
// listTabs(categoryId).then(res => {
//     console.log(res.status)
// }).catch(err => {
//     console.log(err.code)
// });
// listByTab(categoryId, tab).then(res => {
//     console.log(res.status)
// }).catch(err => {
//     console.log(err.code)
// });


exports.listAll = listAll;
exports.listTabs = listTabs;
exports.listByTab = listByTab;
