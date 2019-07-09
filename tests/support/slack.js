const { request } = require('https')
const { bodyOf } = require('./message.body')

const postMessage = (channel, text, bearerToken)=> {
    let message = {
        method: 'POST',
        host: 'slack.com',
        path: '/api/chat.postMessage',
        headers: {
            'Authorization': 'Bearer ' + bearerToken,
            'Content-type': 'application/json'
        }
    }
    return new Promise((resolve, reject)=>{
        let please = request(message, async (response)=>{
            let body = await bodyOf(response)
            try {
                resolve(JSON.parse(body))
            }
            catch (e) {
                reject(e)
            }
        })
        please.on('error', (e)=>{
            reject(e)
        })
        please.end(JSON.stringify({
            channel: channel,
            text: text
        }))
    })
}

module.exports = {
    postMessage:postMessage
}
