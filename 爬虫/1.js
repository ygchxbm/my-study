const axios = require('axios');
const cheerio = require('cheerio');


// headers: {
//     'applicationid': 'app.podcast.cosmos',
//         'app-version': '1.6.0',
//         'x-jike-device-id': 'f5d56d9a-8530-49a4-a6d2-cfb4b7a31240',
//         'user-agent': 'okhttp/4.7.2',
//     // 'x-jike-access-token': token_updated.data['x-jike-access-token']
// }
const headers = {
    applicationid: 'app.podcast.cosmos',
    'app-version': '1.6.0',
    'x-jike-device-id': 'f5d56d9a-8530-49a4-a6d2-cfb4b7a31240',
    'user-agent': 'okhttp/4.7.2',
};

const h = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiamwyeGFRclhLRVE4Vm1ZSmlNVHYwKzNsWVhVcHpDSG8xZEt3SGJYS1d4MUhUY0ZzbytacndxeW5GZWNsaWJpZUZldFhieVg2M1ArS1VMeXJVQXl4UFUxK1d1Z1EwSUltcnR6WUE1V0Q0aDVUSTdXb05RNWRYdGwxeDFoanlsVEZJb2ViWW1oUitCbGdhVHBvNCtyMGlVSnBMbER5dWZlM1NjNER3NDVpWmZuYTk4Rmx5Y29iU1wvKytmTmZSWTNvNyIsInYiOjMsIml2IjoiaWtuYzA2Uzg5STA0TFwvVlQ4Tm9RQ0E9PSIsImlhdCI6MTcxMjgyNjc3NS4xNDV9.5zP5YgKfrxm-woyBvOfRRuRnxVTmR1XOtKn_c0S_juU';

function refresh() {
    const url = "https://api.xiaoyuzhoufm.com/app_auth_tokens.refresh";
    axios.post(url, {}, {
        headers: {
            ...headers,
            'x-jike-refresh-token': h
        }
    }).then(res => {
        // debugger
        console.log(res)
    })
}

refresh();


function list() {

// 目标网页URL
    const url = 'https://api.xiaoyuzhoufm.com/v1/editor-pick/list';
// const headers = {
//     applicationid: 'app.podcast.cosmos',
//     'app-version': '1.6.0',
//     'x-jike-device-id': device_id,
//     'user-agent': 'okhttp/4.7.2',
// };
// 发起HTTP GET请求
    axios.post(url, {}, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your_access_token',
            'applicationid': 'app.podcast.cosmos',
            'app-version': '1.6.0',
            'x-jike-device-id': 'f5d56d9a-8530-49a4-a6d2-cfb4b7a31240',
            'user-agent': 'okhttp/4.7.2',
        }
    }).then(res => {
        console.log(res)
    })
}


function podcast() {
    const url = "https://www.xiaoyuzhoufm.com/podcast/60beb756ef742260587c883b";
    axios.get(url).then(res => {
        const $ = cheerio.load(res.data);
        const page_data = JSON.parse($('#__NEXT_DATA__')[0].children[0].data);
        const episodes = page_data.props.pageProps.podcast.episodes;
        debugger
        console.log(episodes)
    })
}

// podcast();

async function main() {
    const url1 = "https://api.xiaoyuzhoufm.com/app_auth_tokens.refresh";
    const refreshRes = await axios.post(url1, {}, {
        headers: {
            ...headers,
            'x-jike-refresh-token': h
        }
    })
    // debugger
    const accessToken = refreshRes.data['x-jike-access-token']
    const url2 = "https://api.xiaoyuzhoufm.com/v1/editor-pick/list"
    const listRes = await axios.post(url2, {}, {
        headers: {
            ...headers,
            'x-jike-access-token': accessToken
        }
    })
    // debugger
    console.log(listRes)
    const url3 = "https://api.xiaoyuzhoufm.com/v1/category/list-all"
    const listAllRes = await axios.post(url3, {}, {
        headers: {
            ...headers,
            'x-jike-access-token': accessToken
        }
    })
    console.log(listAllRes)

    const url4="https://api.xiaoyuzhoufm.com/v1/category/podcast/list-by-tab";
    const params = {
        "categoryId": "63c76a8924b1622727bd3219",
        "tab": "ALL",
        "omitSubscribed": false,
        "loadMoreKey":100,
    }
    const oneClassRes = await axios.post(url4, params, {
        headers: {
            ...headers,
            'x-jike-access-token': accessToken
        }
    })
    console.log(accessToken)
    debugger
    console.log(oneClassRes)
}

main().then(res => {
    console.log(res)
})
