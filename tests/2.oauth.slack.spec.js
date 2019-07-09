const { expect } = require('chai')
const {
    postMessage
} = require('./support/slack')

const TOKEN = process.env.SLACK_ACCESS_TOKEN

describe('oauth with slack', ()=>{

    it('works well', async ()=>{
        var result = await postMessage('@eric.mignot', 'Just checking I am still ok...', TOKEN)

        expect(result.ok).to.equal(true)
    })
})
