/**
 * 
 * 
 */

// ts-ignore
import { join as pathJoin } from 'path';
import { stat as fsStat } from 'fs/promises';

import _send from './send';
import { BadRequest, InternalServerError, NotFound, require } from './index';

export default (
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

    const appPath = pathJoin(dist, `${appName}-app`);

    // console.log(39, '----------\n', appName, '\n', appPath );

    fsStat(appPath).then(

      stats => {

        // logging(39, '----------\n', appName, '\n', appPath )

        if (!stats.isDirectory()) throw { code: 'ENOENT', path: '-app' }
        return (router => router.default || router)(require(appPath))
      }

    ).then(

      (/** @type {any} */ router) => {
        try { new router(res) }
        catch (err) { res.end() }
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

        else send(res, new InternalServerError(err))
      }

    )
  }
}
