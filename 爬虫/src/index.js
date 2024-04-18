const path = require('node:path');
const jsonData = require('../env.json');
const axios = require("axios");
const refreshToken = jsonData["x-jike-refresh-token"];

const headers = {
    applicationid: 'app.podcast.cosmos',
    'app-version': '1.6.0',
    'x-jike-device-id': 'f5d56d9a-8530-49a4-a6d2-cfb4b7a31240',
    'user-agent': 'okhttp/4.7.2',
};

async function main() {
    const accessToken = await getAccessToken();
    debugger
}


main().then(res => {
    console.log(res)
})

async function getAccessToken() {
    const url = "https://api.xiaoyuzhoufm.com/app_auth_tokens.refresh";
    const refreshRes = await axios.post(url, {}, {
        headers: {
            ...headers,
            'x-jike-refresh-token': refreshToken,
        }
    })
    return refreshRes.data['x-jike-access-token']
}
