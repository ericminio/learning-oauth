const { request } = require('https')
const { bodyOf } = require('./message.body')

const bearerTokenRequest = (key, secret)=> {
    let tokenCredentials = Buffer.from(
        encodeURIComponent(key) + ':' + encodeURIComponent(secret))
        .toString('base64')

    return {
        method: 'POST',
        host: 'api.twitter.com',
        path: '/oauth2/token',
        headers: {
            'Authorization': 'Basic ' + tokenCredentials,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    }
}
const getBearerToken = (please)=>{
    let p = new Promise((resolve, reject)=>{
        let action = request(please, async (response)=>{
            let body = await bodyOf(response)
            let data = JSON.parse(body)
            resolve(data['access_token'])
        })
        action.on('error', (e)=>{
            reject(e)
        })
        action.write('grant_type=client_credentials')
        action.end()
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
    bearerTokenRequest: bearerTokenRequest,
    getBearerToken: getBearerToken,
    fetch: fetch
}
