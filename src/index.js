/**
 * middleware
 * 
 */

/** 
 
@typedef {import('net').AddressInfo} NetAddressInfo */

import { createRequire } from 'module';
import middleware from './middleware'
import listen from './listen';

export const require = createRequire(import.meta.url)
export const { BadRequest, InternalServerError, NotFound, isHttpError } = require('http-errors');
export const ContentType = 'content-type';
export const TypeApplicationJson = 'application/json; charset=utf-8';

export { 
  middleware, 
  listen
}