const R = require('ramda')

const convertItemsToPutRequests = R.map(R.pipe(
	R.objOf('Item'),
	R.objOf('PutRequest')
))

function readAllFrom(dyno) {
	return new Promise((resolve, reject) => {
		dyno.scan({ Pages: 1 }, (error, data) => {
			if (error) {
				reject(error)
			}
			else {
				resolve(data.Items)
			}
		})
	})
}

module.exports = {
	convertItemsToPutRequests,
	readAllFrom
}