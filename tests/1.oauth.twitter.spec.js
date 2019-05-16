const { expect } = require('chai')
const {
    bearerTokenRequest,
    getBearerToken,
    fetch
} = require('./support/twitter')

const KEY = process.env.CONSUMER_KEY
const SECRET = process.env.CONSUMER_SECRET

describe('oauth with twitter', ()=>{

    it('requires a bearer token', async ()=>{
        let bearerPlease = bearerTokenRequest(KEY, SECRET)
        let bearerToken = await getBearerToken(bearerPlease)

        expect(bearerToken.length).not.to.equal(undefined)
    })

    it('gives you power', async ()=>{
        let bearerPlease = bearerTokenRequest(KEY, SECRET)
        let bearerToken = await getBearerToken(bearerPlease)
        let info = await fetch('/1.1/statuses/user_timeline.json?count=1&screen_name=ericminio', bearerToken)

        expect(info[0].user.screen_name).to.equal('EricMinio')
    })
})
