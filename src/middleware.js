/**
 * @author
 * 
 */

import { createServer } from "http";
// ts-ignore
// import { BadRequest, InternalServerError, isHttpError, NotFound } from 'http-errors';
import { join as pathJoin } from 'path';

import _logging from './logging';
import _server from './server';
import _listen from './listen';

/** @arg {MiddlewareArgs} arg */ 
export default ({
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
  if (!etc) etc = pathJoin(dirname, 'etc');
  if (!dist) dist = pathJoin(dirname, 'dist')

  if (server === undefined) server = createServer(_server({ logging, name, dist }))

  if (!test) {
    if (server?.listen) server.listen(NODE_PORT, host, _listen({ dirname, NODE_ENV, logging }))
    return { server, logging, dirname, NODE_ENV }
  }
  else return { server, host, NODE_ENV, NODE_PORT, etc, dist, cache, name, dirname, logging }

}