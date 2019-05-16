const { expect } = require('chai')
const { request } = require('https')
const token = (credentials)=>{
    return encodeURIComponent(credentials.key) + ':' + encodeURIComponent(credentials.secret)
}
const encodedToken = (credentials)=>{
    let token = encodeURIComponent(credentials.key) + ':' + encodeURIComponent(credentials.secret)
    return Buffer.from(token).toString('base64')
}

describe('oauth', ()=>{

    it('requires a token credentials', ()=>{
        let credentials = {
            key: 'xvz1evFS4wEEPTGEFPHBog',
            secret: 'L8qq9PZyRg6ieKGEKhZolGC0vJWLw8iEJ88DRdyOg'
        }

        expect(encodedToken(credentials)).to.equal('eHZ6MWV2RlM0d0VFUFRHRUZQSEJvZzpMOHFxOVBaeVJnNmllS0dFS2hab2xHQzB2SldMdzhpRUo4OERSZHlPZw==')
    })

    it('requires a bearer token', (done)=>{
        let credentials = {
            key: process.env.CONSUMER_KEY,
            secret: process.env.CONSUMER_SECRET
        }
        let token = encodedToken(credentials)
        var bearerPlease = {
            method: 'POST',
            host: 'api.twitter.com',
            path: '/oauth2/token',
            headers: {
                'Authorization': 'Basic ' + token,
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        }
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
        let credentials = {
            key: process.env.CONSUMER_KEY,
            secret: process.env.CONSUMER_SECRET
        }
        let token = encodedToken(credentials)
        var bearerPlease = {
            method: 'POST',
            host: 'api.twitter.com',
            path: '/oauth2/token',
            headers: {
                'Authorization': 'Basic ' + token,
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        }
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
