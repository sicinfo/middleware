/**
 * @author
 */

const { createServer } = require('http')
const { join: pathJoin } = require('path')
const { stat: fsStat } = require('fs/promises')
const { BadRequest, InternalServerError, isHttpError, NotFound } = require('http-errors');

const ContentType = 'content-type';
const TypeApplicationJson = 'application/json; charset=utf-8';

module.exports = (/** @type {MiddlewareArgs} */ {
  test = !!process.env.test,
  NODE_ENV = process.env.NODE_ENV || 'deve',
  NODE_PORT = Number.parseInt(process.env.NODE_PORT) || 3000,
  etc = process.env.etc,
  dist = process.env.dist || process.env.watch,
  dirname = process.env.cwd || process.env.PWD,
  cache = new Map(),
  name = 'middleware',
  server,
  logging
}) => {

  if (!logging) logging = test || NODE_ENV.toLowerCase().startsWith('prod') ?
    (/** @type {...any} */ ...args) => { } :
    (/** @type {...any} */ ...args) => { console.info(args.join('\n')) }

  if (!etc) etc = pathJoin(dirname, 'etc')
  if (!dist) dist = pathJoin(dirname, 'dist')
  else if (/,/.test(dist)) dist = dist.split(',')[0]

  /** 
   * @param {HttpServerResponse} res
   * @param {any} err
   */
  const send = (res, err) => {
    logging('-> constructor', err.stack || err, '\n', typeof err === 'object'  && Object.keys(err));
    if (!isHttpError(err)) err = new InternalServerError(err)
    res.setHeader(ContentType, TypeApplicationJson)
    res.statusCode = err.status
    res.end(JSON.stringify(err))
  }

  if (server === undefined) server = createServer((req, res) => {

    logging(`-> ${name}: ${new Date().toISOString()} - HTTP ${req.method} ${req.url}`);

    const [appname] = req.url.split('/').slice(1)
    if (!appname) return send(res, new BadRequest('[Middleware] App undefined'))
    if (/\./.test(appname)) return send(res, new BadRequest())

    const _appname = pathJoin(dist, `${appname}-app`);
    const appjson = pathJoin(_appname, `package.json`);

    fsStat(_appname).then(

      stats => {
        if (!stats.isDirectory()) throw { code: 'ENOENT', path: '-app' }
        return fsStat(appjson)
      }

    ).then(

      stats => {
        if (!stats.isFile()) throw { code: 'ENOENT', path: 'package.json' }
        return require(_appname)
      }

    ).then(

      router => {
        try { new router({ req, res, etc }) }
        catch (err) { res.end() }
      }

    ).catch(

      err => {

        if (['MODULE_NOT_FOUND', 'ENOENT'].includes(err.code)) {
        
          const msg0 = err.requestPath?.endsWith('-app') ? 'Main' :
            err.path.endsWith('-app') ? 'App' :
              err.path.endsWith('package.json') ? 'Json' :
                err.requestPath ? 'Service' : 'Main';

          const msg1 = 'not found';

          send(res, new NotFound(`[Middleware] ${msg0} ${msg1} (${appname})`))
        }

        else send(res, new InternalServerError(err))
      }

    )
  })

  if (!test) {
    if (server?.listen) server.listen(
      NODE_PORT,
      NODE_ENV === 'prod' ? undefined : /** @this {NetServer} */ function () {

        const { address, port } = /** @type {NetAddressInfo} */ (this.address())

        const args = [
          `${process.title.split(' ')[0]} ${process.version}`,
          `${new Date().toISOString()}: Listening: (${NODE_ENV})`,
          `-> ${address}:${port}${dirname}`,
          '\n.'.repeat(0)
        ]

        const maxLength = 1 * args.reduce((a, b) => Math.max(a, b.length), 0)

        logging([' ', '-'.repeat(maxLength), ...args].join('\n'));
      }
    )
    return { server, logging }
  }

  return { server, NODE_ENV, NODE_PORT, etc, dist, cache, test, name, dirname, logging }

}