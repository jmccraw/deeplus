/**
 * Compare values give various operators and values to compare
 * Taken from Jarret Gabel: https://code.espn.com/contentDesign/offseason_dominoes/blob/master/src/assets/helpers/helpers.js#L59
 * @param  {[type]} v1
 * @param  {[type]} operator
 * @param  {[type]} v2
 * @param  {Object} options
 * @return {[type]}
 */
module.exports = function( v1, operator, v2, options ) {
  const operators = {
    '==': v1 == v2 ? true : false,
    '===': v1 === v2 ? true : false,
    '!=': v1 != v2 ? true : false,
    '!==': v1 !== v2 ? true : false,
    '>': v1 > v2 ? true : false,
    '>=': v1 >= v2 ? true : false,
    '<': v1 < v2 ? true : false,
    '<=': v1 <= v2 ? true : false,
    '||': v1 || v2 ? true : false,
    '&&': v1 && v2 ? true : false
  }
  if ( operators.hasOwnProperty( operator ) ) {
    if ( operators[operator] ) {
      return options.fn( this );
    }
    return options.inverse( this );
  }
  return console.error( `Error: Expression "${operator}" not found` );
};