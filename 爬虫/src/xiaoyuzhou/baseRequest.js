const axios = require("axios");
const jsonData = require("./evn.json");

const bastUrl = "https://www.xiaoyuzhoufm.com"

const headers = {
    'x-jike-access-token': jsonData['x-jike-access-token']
};

module.exports = function ({url, methods, params}) {
    if (methods === "get") {
     return    axios.get(bastUrl + url, {
            headers
        })
        //  .then(res => {
        //     func(res)
        // }).catch(err => {
        //     console.log(err.code)
        // })
    } else if (methods === "post") {
      return   axios.post(bastUrl + url, params, {
            headers
        })
        //   .then(res => {
        //     func(res)
        // }).catch(err => {
        //     console.log(err.code)
        // })
    }
}



//demo
// function searchCreate() {
//     const url = `/v1/search/create`;
//     const methods = "post";
//     const params = {};
//     const func = res => {
//         console.log(res.status)
//         console.log(res.data.data.length)
//     }
//     baseRequest({url, methods, params, func})
// }
