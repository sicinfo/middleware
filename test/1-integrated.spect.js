/**
 * https://www.chaijs.com/api/
 * https://dev.to/lucifer1004/test-driven-development-of-an-http-server-with-koajs-25b8
 * 
 * https://www.chaijs.com/plugins/chai-http/
 */
'use strict';

const assert = require('assert');
const http = require('http');

const middleware = require('sicinfo-middleware/src/middleware')

const NODE_PORT = 3999;
const NODE_ENV = 'test';
const addUrl = (/** @type {string[]} */ ...arg) => [`http://localhost:${NODE_PORT}`, ...arg].join('/')

const { server } = middleware({ 
  NODE_PORT, 
  NODE_ENV, 
  dist: `${process.env.PWD}/test/dist` 
})

const listen = () => { server.listen(NODE_PORT) }
const close = () => { server.close() }

describe('integrated test', () => {

  before(() => listen());
  after(() => close());

  it('#1. get without url', done => {
    http.get(addUrl(), res => {
      assert.equal(res.statusCode, 400, 'shold be "400"');
      done();
    });
  })

  it('#2. get test', done => {
    http.get(addUrl('teste'), res => {
      assert.equal(res.statusCode, 404, 'shold be "404"');
      done();
    });
  })

  it('#3. get config', done => {
    http.get(addUrl('config','config'), res => {
      let data = '';
      res.on('data', (arg = '') => { data += arg});
      res.on('end', () => {
        const { method, url } = JSON.parse(data);
        assert.equal(res.statusCode, 200, 'shold be "200"');
        assert.equal(method, 'GET', 'shold be "GET"');
        assert.equal(url, '/config/config', 'shold be "/config/config"');
        done();
      })
    });
  })

})
