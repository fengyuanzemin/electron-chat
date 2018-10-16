const axios = require('axios');
const key = require('./robot-key');

module.exports = (data) => {
    return axios({
        url: 'http://www.tuling123.com/openapi/api',
        params: {
            key,
            info: data.replace('@风', '')
        }
    })
}