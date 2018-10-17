const axios = require('axios');
const colors = require('colors');

let key = ''
try {
    key = require('./robot-key');
} catch (e) {
    console.log('=====error========应该创建 robot-key 文件========'.red);
}

module.exports = (data) => {
    return axios({
        url: 'http://www.tuling123.com/openapi/api',
        params: {
            key,
            info: data.replace('@风', '')
        }
    })
}