
/** @typedef {import('http').ServerResponse} HttpServerResponse */
/** @typedef {import('http').Server} HttpServer */
/** @typedef {import('net').Server} NetServer */
/** @typedef {import('net').AddressInfo} NetAddressInfo */
/** @typedef {import('http').IncomingMessage} IncomingMessage*/
/** @typedef {import('http').ServerResponse} ServerResponse*/

/**
 * @typedef {string} NameArg
 * @typedef {string} DistArg
 * @typedef {function} LoggingArg
 */

/** 
 * @typedef ServerArgs
 * @property {DistArg} dist
 * @property {NameArg} name
 * @property {LoggingArg} logging
 */ 

/** 
 * @typedef MiddlewareArgs
 * @property {HttpServer} [server]
 * @property {LoggingArg} [logging]
 * @property {Map<string,Promise<Map<string,any>>>} [cache]
 * @property {string} [NODE_ENV]
 * @property {number} [NODE_PORT]
 * @property {string} [host]
 * @property {string} [PWD]
 * @property {string} [watch]
 * @property {DistArg} [dist]
 * @property {string} [etc]
 * @property {string} [dirname]
 * @property {string} [cwd]
 * @property {NameArg} [name]
 */
