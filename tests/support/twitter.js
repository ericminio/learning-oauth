const { request } = require('https')
const { bodyOf } = require('./message.body')

const getBearerToken = (key, secret)=>{
    let tokenCredentials = Buffer.from(
        encodeURIComponent(key) + ':' + encodeURIComponent(secret))
        .toString('base64')
    let info = {
        method: 'POST',
        host: 'api.twitter.com',
        path: '/oauth2/token',
        headers: {
            'Authorization': 'Basic ' + tokenCredentials,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    }
    let p = new Promise((resolve, reject)=>{
        let please = request(info, async (response)=>{
            let body = await bodyOf(response)
            let data = JSON.parse(body)
            resolve(data['access_token'])
        })
        please.on('error', (e)=>{
            reject(e)
        })
        please.write('grant_type=client_credentials')
        please.end()
    })
    return p
}
const fetch = async (endpoint, bearerToken)=>{
    let info = {
        method: 'GET',
        host: 'api.twitter.com',
        path: endpoint,
        headers: {
            'Authorization': 'Bearer ' + bearerToken
        }
    }
    let p = new Promise((resolve, reject)=>{
        let please = request(info, async (response)=>{
            let body = await bodyOf(response)
            resolve(JSON.parse(body))
        })
        please.on('error', (e)=>{
            reject(e)
        })
        please.end()
    })
    return p
}

module.exports = {
    getBearerToken: getBearerToken,
    fetch: fetch
}
