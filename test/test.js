// @ts-ignore
import { equal } from 'assert';
// @ts-ignore
import http from 'http';
// @ts-ignore
const { PWD } = process.env;

// @ts-ignore
import { middleware } from 'sicinfo-middleware';

describe('middleware basic test', () => {

  it('#0. NODE_ENV', () => {
    equal(middleware({ server: null, NODE_ENV: 'test'}).NODE_ENV, 'test', 'shold be "test"');
    equal(middleware({ server: null}).NODE_ENV, 'deve', 'shold be "deve"');
  })

  it('#1. NODE_PORT', () => {
    equal(middleware({server: null, NODE_ENV: 'test', NODE_PORT: 9999}).NODE_PORT, 9999, 'shold be "9999"');
    equal(middleware({server: null, NODE_ENV: 'test'}).NODE_PORT, 3000, 'shold be "3000"');
  })

  it(`#2. dirname`, () => {
    equal(middleware({server: null, NODE_ENV: 'test', dirname: 'teste'}).dirname, 'teste', 'shold be "teste"');
    equal(middleware({server: null, NODE_ENV: 'test'}).dirname, PWD, `shold be "${PWD}"`);
  })

  it(`#3. dist`, () => {
    equal(middleware({server: null, NODE_ENV: 'test', dist: 'test'}).dist, 'test', 'shold be "test"');
    const mid = middleware({server: null, NODE_ENV: 'test'});
    const dist = `${PWD}/dist`;
    equal(mid.dist, dist, `shold by ${dist}`)
  })

  it(`#4. etc`, () => {
    equal(middleware({server: null, NODE_ENV: 'test', etc: 'test'}).etc, 'test', 'shold be "test"');
    const mid = middleware({server: null, NODE_ENV: 'test'});
    const etc = `${mid.dirname}/etc`;
    equal(mid.etc, etc, `shold by ${etc}`)
  })


})

describe('integrated test', () => {
  
  const NODE_PORT = 3999;
  const NODE_ENV = 'test';
  const addUrl = (/** @type {string[]} */ ...arg) => [`http://localhost:${NODE_PORT}`, ...arg].join('/');
  const { server } = middleware({ NODE_PORT, NODE_ENV, dist: `${PWD}/test/dist` });

  before(() => server.listen(NODE_PORT));
  after(() => server.close());

  it('#1. get without url', done => {
    http.get(addUrl(), (/** @type {{ statusCode: number; }} */ res) => {
      equal(res.statusCode, 400, 'shold be "400"');
      done();
    })
  })

  it('#2. get test', done => {
    http.get(addUrl('teste'), (/** @type {{ statusCode: number; }} */ res) => {
      equal(res.statusCode, 404, 'shold be "404"');
      done();
    })
  })

  it('#3. get config', done => {
    http.get(addUrl('config','config'), (/** @type {{ on: (arg0: string, arg1: { (arg?: string): void; (): void; }) => void; statusCode: any; }} */ res) => {
      let data = '';
      res.on('data', (arg = '') => { data += arg});
      res.on('end', () => {
        const { method, url } = JSON.parse(data);
        equal(res.statusCode, 200, 'shold be "200"');
        equal(method, 'GET', 'shold be "GET"');
        equal(url, '/config/config', 'shold be "/config/config"');
        done();
      })
    })
  })

})
