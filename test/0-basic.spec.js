/**
 * 
 */

const assert = require('assert');

const middleware = require('sicinfo-middleware/src/middleware')

describe('middleware basic test', () => {

  it('#0. NODE_ENV', () => {
    assert.equal(middleware({server: null, NODE_ENV: 'test'}).NODE_ENV, 'test', 'shold be "test"');
    assert.equal(middleware({server: null}).NODE_ENV, undefined,'shold be "deve"');
  })

  it('#1. NODE_PORT', () => {
    assert.equal(middleware({server: null, NODE_ENV: 'test', NODE_PORT: 9999}).NODE_PORT, 9999, 'shold be "9999"');
    assert.equal(middleware({server: null, NODE_ENV: 'test'}).NODE_PORT, 3000, 'shold be "3000"');
  })

  it(`#2. dirname`, () => {
    assert.equal(middleware({server: null, NODE_ENV: 'test', dirname: 'teste'}).dirname, 'teste', 'shold be "teste"');
    assert.equal(middleware({server: null, NODE_ENV: 'test'}).dirname, process.env.PWD, `shold be "${process.env.PWD}"`);
  })

  it(`#3. dist`, () => {
    assert.equal(middleware({server: null, NODE_ENV: 'test', dist: 'test'}).dist, 'test', 'shold be "test"');
    const mid = middleware({server: null, NODE_ENV: 'test'});
    const dist = `${process.env.PWD}/dist`;
    assert.equal(mid.dist, dist, `shold by ${dist}`)
  })

  it(`#4. etc`, () => {
    assert.equal(middleware({server: null, NODE_ENV: 'test', etc: 'test'}).etc, 'test', 'shold be "test"');
    const mid = middleware({server: null, NODE_ENV: 'test'});
    const etc = `${mid.dirname}/etc`;
    assert.equal(mid.etc, etc, `shold by ${etc}`)
  })

})
