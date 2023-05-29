
/** @typedef {import('http').ServerResponse} HttpServerResponse */
/** @typedef {import('http').Server} HttpServer */
/** @typedef {import('net').Server} NetServer */
/** @typedef {import('net').AddressInfo} NetAddressInfo */

/** 
 * @typedef MiddlewareArgs
 * @property {HttpServer} [server]
 * @property {function} [logging]
 * @property {Map<string,Promise<Map<string,any>>>} [cache]
 * @property {string} [NODE_ENV]
 * @property {number} [NODE_PORT]
 * @property {string} [PWD]
 * @property {string} [watch]
 * @property {string} [dist]
 * @property {string} [etc]
 * @property {string} [dirname]
 * @property {string} [cwd]
 * @property {string} [name]
 * @property {boolean} [test]
 */

