const fs = require("fs");
const axios = require("axios");
const refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiamwyeGFRclhLRVE4Vm1ZSmlNVHYwKzNsWVhVcHpDSG8xZEt3SGJYS1d4MUhUY0ZzbytacndxeW5GZWNsaWJpZUZldFhieVg2M1ArS1VMeXJVQXl4UFUxK1d1Z1EwSUltcnR6WUE1V0Q0aDVUSTdXb05RNWRYdGwxeDFoanlsVEZJb2ViWW1oUitCbGdhVHBvNCtyMGlVSnBMbER5dWZlM1NjNER3NDVpWmZuYTk4Rmx5Y29iU1wvKytmTmZSWTNvNyIsInYiOjMsIml2IjoiaWtuYzA2Uzg5STA0TFwvVlQ4Tm9RQ0E9PSIsImlhdCI6MTcxMjgyNjc3NS4xNDV9.5zP5YgKfrxm-woyBvOfRRuRnxVTmR1XOtKn_c0S_juU';
const filePath = 'evn.json';

const url = "https://api.xiaoyuzhoufm.com/app_auth_tokens.refresh";
axios.post(url, {}, {
    headers: {
        'x-jike-refresh-token': refreshToken
    }
}).then(res => {
    if (res && res.data) {
        const accessToken = res.data['x-jike-access-token'];
        const jsonString = '{"x-jike-access-token":' + '"' + accessToken + '"' + '}'
        fs.writeFile(filePath, jsonString, (err) => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log('Successfully wrote string to JSON file:', filePath);
            }
        });
    }
})
