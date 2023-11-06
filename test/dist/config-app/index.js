module.exports = class {

  /**
   * @param {{req:import('http').IncomingMessage, res:import('http').ServerResponse}} param0 
   */
  constructor(res) {
    res.setHeader('content-type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({
      method: res.req.method,
      url: res.req.url
    }))
  }



}