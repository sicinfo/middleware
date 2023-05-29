/**
 * https://www.chaijs.com/api/
 * https://dev.to/lucifer1004/test-driven-development-of-an-http-server-with-koajs-25b8
 * 
 * https://www.chaijs.com/plugins/chai-http/
 */
'use strict';

const httpErrors = require('http-errors')
const chai = require("chai");
chai.use(require('chai-http'));

const { expect } = chai;

const middleware = require('sicinfo-middleware/src/middleware')

const { etc, dist, dirname, server } = middleware({
  test: true,
  dirname: __dirname,
  NODE_ENV: 'test'
});

let req = chai.request(server).keepOpen()

if (false) describe("Basic test", () => {

  it(`should be dist __dirname/dist`, done => {
    expect(dist).equal(`${__dirname}/dist`)
    done()
  })

  it(`should be etc __dirname/etc`, done => {
    expect(etc).equal(`${__dirname}/etc`)
    done()
  })

})

describe("Integration basic test", () => {

  after(() => { req.close() })

  it(`should be App undefined - #GET /`, done => {
    req.get('/').then(res => {
      expect(res.body.message).to.equal('[Middleware] App undefined')
      done()
    }).catch(err => { done(err) })
  })

  it(`should be App undefined - #GET /arquivo`, done => {
    req.get('/arquivo').then(res => {
      expect(res.body.message).to.equal('[Middleware] App not directory (arquivo)')
      done()
    }).catch(err => { done(err) })
  })

  it(`should be Main not found - #GET /diretorio`, done => {
    req.get('/diretorio').then(res => {
      expect(res.body.message).to.equal(`[Middleware] Main not found (diretorio)`)
      done()
    }).catch(err => { done(err) })
  })

  it(`should be Service not found - #GET /notmodule`, done => {
    req.get('/notmodule').then(res => {
      expect(res.body.message).to.equal(`[Middleware] Service not found (notmodule)`)
      done()
    }).catch(err => { done(err) })
  })

  it(`should be Service1 ok - #GET /service1`, done => {
    req.get('/service1').then(res => {
      expect(res.text).to.empty
      done()
    }).catch(err => { done(err) })
  })

  it(`should be Service2 ok - #GET /service2`, done => {
    req.get('/service2').then(res => {
      expect(res.body.method).to.equal('GET')
      expect(res.body.url).to.equal('/service2')
      done()
    }).catch(err => { done(err) })
  })

})


//   it(`#GET /serviceundefined`, done => {
//     req.get('/serviceundefined').end((err, res) => {
//       if (err) return done(err)

//       console.log(34, res)

//       expect(res.text).to.equal('Service undefined');
//       expect(res).to.have.status(400);
//       done();
//     })
//   })

// })