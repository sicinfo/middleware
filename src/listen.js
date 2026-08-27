/**
 * 
 */

export default (
  /** @type {any} */ { dirname, NODE_ENV, logging }
) => NODE_ENV.startsWith('p') ?
    undefined :
    /** @this {NetServer} */
    function () {

      const { address, port } = /** @type {NetAddressInfo} */ (this.address())

      const args = [
        `${process.title.split(' ')[0]} ${process.version}`,
        `${new Date().toISOString()}: Listening: (${NODE_ENV})`,
        `-> ${address}:${port}${dirname}`,
        '\n.'.repeat(0)
      ]

      const maxLength = 1 * args.reduce((a, b) => Math.max(a, b.length), 0)

      logging([' ', '-'.repeat(maxLength), ...args].join('\n'));
    }