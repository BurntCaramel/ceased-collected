const R = require('ramda')

module.exports = R.flatten([
  require('./stories'),
	require('./items'),
	require('./ids')
])
