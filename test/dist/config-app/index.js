module.exports = class {

   /**
   * @param {any} res
   */
   constructor(res) {
    res.setHeader('content-type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({
      method: res.req.method,
      url: res.req.url
    }))
  }



}