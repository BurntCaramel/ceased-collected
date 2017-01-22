const Crypto = require('crypto')

function createHMACForString(string) {
	const hmac = Crypto.createHmac('sha256', process.env.ID_HMAC_SECRET)
	hmac.update(string)
	return hmac.digest('hex')
}

module.exports = {
  createHMACForString
}
