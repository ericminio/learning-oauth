const { expect } = require('chai')
const {
    getBearerToken,
    fetch
} = require('./support/twitter')

const KEY = process.env.CONSUMER_KEY
const SECRET = process.env.CONSUMER_SECRET

describe('oauth with twitter', ()=>{

    it('requires a bearer token', async ()=>{
        let bearerToken = await getBearerToken(KEY, SECRET)

        expect(bearerToken.length).not.to.equal(undefined)
    })

    it('gives you power', async ()=>{
        let bearerToken = await getBearerToken(KEY, SECRET)
        let info = await fetch('/1.1/statuses/user_timeline.json?count=1&screen_name=ericminio', bearerToken)

        expect(info[0].user.name).to.equal('Eric Mignot')
    })
})
