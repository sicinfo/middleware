/**
 * middleware
 */

export default (/** @type {boolean} */ arg) => !!arg ? 
  () => { } : 
  (/** @type {*} */...a) => { console.info(a.join('\n')) }