/**
 * 
 */
const { expect } = require("chai");

const middleware = require('sicinfo-middleware/src/middleware')

Object.assign(process.env, require('./package.json').env)

process.env.test = 'true'

describe('middleware basic test', () => {

  it('Should test env', () => {
    expect(middleware({server: null}).test).to.true;
    expect(middleware({server: null, test: false}).test).to.be.undefined;
  })

  it('Should NODE_ENV development', () => {
    expect(middleware({server: null}).NODE_ENV).equal('development')
  })

  it('Should NODE_PORT 3009', () => {
    expect(middleware({server: null}).NODE_PORT).equal(3009)
  })

  it(`Should dirname ${process.env.PWD}`, () => {
    expect(middleware({server: null, dirname: 'teste'}).dirname).equal('teste')
    expect(middleware({server: null}).dirname).equal(process.env.PWD)
  })

  it(`Should dist ${process.env.PWD}/dist`, () => {
    expect(middleware({server: null}).dist).equal(process.env.PWD + '/dist')
  })

  it(`Should etc ${process.env.PWD}/etc`, () => {
    expect(middleware({server: null}).etc).equal(process.env.PWD + '/etc')
  })

})





