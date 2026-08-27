import { createRequire } from 'module';
import { createServer } from 'http';
import { join } from 'path';
import { stat } from 'fs/promises';

/**
 * middleware
 */

var _logging = (/** @type {boolean} */ arg) => !!arg ? 
  () => { } : 
  (/** @type {*} */...a) => { console.info(a.join('\n')); };

/**
 * 
 */


var _send = (
  /** @type {function} */ log
) => (
  /** @type {ServerResponse} */ res,
  /** @type {any} */ err
) => {
  log('-> constructor', err.stack || err, '\n', typeof err === 'object' && Object.keys(err));
  if (!isHttpError(err)) err = new InternalServerError(err);
  res.setHeader(ContentType, TypeApplicationJson);
  res.statusCode = err.status;
  res.end(JSON.stringify(err));
};

/**
 * 
 * 
 */


var _server = (
  /** @type {ServerArgs} */
  { logging, name, dist }
) => {
  
  // console.log(['19 -----------------------', __filename, dist,'.'].join('\n'));
  
  const send = _send(logging);

  return (
    /** @type {IncomingMessage} */ req,
    /** @type {ServerResponse} */ res
  ) => {

    if (!req.url) req.url = '';

    // console.log(['20 -----------------------', __filename, dist,'.'].join('\n'));


    logging(`-> ${name}: ${new Date().toISOString()} - HTTP ${req.method} ${req.url}`);

    const [appName] = req.url.split('/').slice(1);
    if (!appName) return send(res, new BadRequest('[Middleware] App undefined'));
    if (/\./.test(appName)) return send(res, new BadRequest());

    const appPath = join(dist, `${appName}-app`);

    // console.log(39, '----------\n', appName, '\n', appPath );

    stat(appPath).then(

      stats => {

        // logging(39, '----------\n', appName, '\n', appPath )

        if (!stats.isDirectory()) throw { code: 'ENOENT', path: '-app' }
        return (router => router.default || router)(require$1(appPath))
      }

    ).then(

      (/** @type {any} */ router) => {
        try { new router(res); }
        catch (err) { res.end(); }
      }

    ).catch(

      err => {

        // logging(53, '-----------\n', err)


        if (['MODULE_NOT_FOUND', 'ENOENT'].includes(err.code)) {

          send(res, (
            (msg0, msg1) => new NotFound(`[Middleware] ${msg0} ${msg1} (${appName})`)
          )(
            err.requestPath?.endsWith('-app') ? 
              'Main' : 
              err.path?.endsWith('-app') ? 
                'App' : 
                err.path?.endsWith('package.json') ? 
                  'Json' : 
                  err.requestPath ? 
                    'Service' : 
                    'Main',
            'not found'
          ));

        }

        else send(res, new InternalServerError(err));
      }

    );
  }
};

/**
 * 
 */

var _listen = (
  /** @type {any} */ { dirname, NODE_ENV, logging }
) => NODE_ENV.startsWith('p') ?
    undefined :
    /** @this {NetServer} */
    function () {

      const { address, port } = /** @type {NetAddressInfo} */ (this.address());

      const args = [
        `${process.title.split(' ')[0]} ${process.version}`,
        `${new Date().toISOString()}: Listening: (${NODE_ENV})`,
        `-> ${address}:${port}${dirname}`,
        '\n.'.repeat(0)
      ];

      const maxLength = 1 * args.reduce((a, b) => Math.max(a, b.length), 0);

      logging([' ', '-'.repeat(maxLength), ...args].join('\n'));
    };

/**
 * @author
 */


/** @arg {MiddlewareArgs} arg */ 
var middleware = ({
  NODE_ENV = (process.env.npm_package_config_NODE_ENV || process.env.NODE_ENV || 'deve').slice(0, 4),
  NODE_PORT = Number.parseInt(process.env.npm_package_config_port || process.env.NODE_PORT || '') || 3000,
  host = process.env.npm_package_config_host || process.env.host || 'localhost',
  etc = process.env.npm_package_config_etc || process.env.etc,
  dist = process.env.npm_package_config_dist || process.env.npm_config_prefix || process.env.dist || ((/** @type {string} */ arg) => /,/.test(arg) ? arg.split(',')[0] : arg)(process.env.watch || ''),
  dirname = process.env.npm_package_config_dirname || process.env.cwd || process.env.PWD || '',
  cache = new Map(),
  name = process.env.npm_package_name,
  server,
  logging
  
  // NODE_ENV = (process.env.NODE_ENV || 'deve').slice(0, 4),
  // NODE_PORT = Number.parseInt(process.env.NODE_PORT) || 3000,
  // host = process.env.host || 'localhost',
  // etc = process.env.etc,
  // dist = process.env.dist || (dist => /,/.test(dist) ? dist.split(',')[0] : dist)(process.env.watch),
  // dirname = process.env.cwd || process.env.PWD,
  // cache = new Map(),
  // name,
  // server,
  // logging
}) => {

  const test = NODE_ENV.startsWith('t');

  if (!name) name = NODE_ENV;
  if (!logging) logging = _logging(NODE_ENV.startsWith('p'));
  if (!etc) etc = join(dirname, 'etc');
  if (!dist) dist = join(dirname, 'dist');

  if (server === undefined) server = createServer(_server({ logging, name, dist }));

  if (!test) {
    if (server?.listen) server.listen(NODE_PORT, host, _listen({ dirname, NODE_ENV, logging }));
    return { server, logging, dirname, NODE_ENV }
  }
  else return { server, host, NODE_ENV, NODE_PORT, etc, dist, cache, name, dirname, logging }

};

/**
 * middleware
 * 
 */


const require$1 = createRequire(import.meta.url);
const { BadRequest, InternalServerError, NotFound, isHttpError } = require$1('http-errors');
const ContentType = 'content-type';
const TypeApplicationJson = 'application/json; charset=utf-8';

/**
 * middleware
 */
// import { middleware } from "sicinfo-middleware"; 

middleware({});
