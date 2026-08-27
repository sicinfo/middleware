/**
 * 
 */

import { ContentType, TypeApplicationJson, InternalServerError, isHttpError } from './index';

export default (
  /** @type {function} */ log
) => (
  /** @type {ServerResponse} */ res,
  /** @type {any} */ err
) => {
  log('-> constructor', err.stack || err, '\n', typeof err === 'object' && Object.keys(err));
  if (!isHttpError(err)) err = new InternalServerError(err)
  res.setHeader(ContentType, TypeApplicationJson)
  res.statusCode = err.status
  res.end(JSON.stringify(err))
}
