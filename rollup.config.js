/**
 * middleware
 */

export default  [
    // ['src/index.js', `dist/index.js`],
    ['src/script.js', `dist/script.js`],
    ['test/test.js', `test/test.spec.js`]
  ].map(([input, file]) => ({ 
    input, 
    output: { 
      file, 
      format: 'es'
    }, 
    watch: { 
      include: ['src/**'],
      buildDelay: 2000,
      clearScreen: false
    }
  }))
