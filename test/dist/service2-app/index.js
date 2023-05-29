module.exports = class {

  /**
   * @param {{req:import('http').IncomingMessage, res:import('http').ServerResponse}} param0 
   */
  constructor({ req, res }) {
    res.setHeader('content-type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({
      method: req.method,
      url: req.url
    }))
  }



}