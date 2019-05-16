const { expect } = require('chai')
const { request } = require('https')
const KEY = process.env.CONSUMER_KEY
const SECRET = process.env.CONSUMER_SECRET

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
describe('oauth with twitter', ()=>{

    it('requires a bearer token', (done)=>{
        var bearerPlease = bearerTokenRequest(KEY, SECRET)
        var action = request(bearerPlease, (response)=>{
            var answer = ''
            response.on('data', (chunk)=>{
                answer += chunk
            })
            response.on('end', ()=>{
                let data = JSON.parse(answer)
                expect(data['token_type']).to.equal('bearer')
                expect(data['access_token'].length > 0).to.equal(true)
                done()
            })
        })
        action.on('error', (e)=>{
            expect(e).to.equal(null)
            done()
        })
        action.write('grant_type=client_credentials')
        action.end()
    })

    it('gives you power', (done)=>{
        var bearerPlease = bearerTokenRequest(KEY, SECRET)
        var action = request(bearerPlease, (response)=>{
            var answer = ''
            response.on('data', (chunk)=>{
                answer += chunk
            })
            response.on('end', ()=>{
                let data = JSON.parse(answer)
                var infoPlease = {
                    method: 'GET',
                    host: 'api.twitter.com',
                    path: '/1.1/statuses/user_timeline.json?count=1&screen_name=ericminio',
                    headers: {
                        'Authorization': 'Bearer ' + data['access_token']
                    }
                }
                var info = request(infoPlease, (resp)=>{
                    var answer = ''
                    resp.on('data', (chunk)=>{
                        answer += chunk
                    })
                    resp.on('end', ()=>{
                        let tweets = JSON.parse(answer)

                        expect(tweets[0].user.screen_name).to.equal('EricMinio')
                        done()
                    })
                })
                info.on('error', (e)=>{
                    expect(e).to.equal(null)
                    done()
                })
                info.end()
            })
        })
        action.on('error', (e)=>{
            expect(e).to.equal(null)
            done()
        })
        action.write('grant_type=client_credentials')
        action.end()
    })
})
