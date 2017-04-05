const HashIDs = require('hashids')

const hashIDs = new HashIDs(process.env.ID_HASHIDS_SECRET, 5)

module.exports = {
	userToDatabaseID: (userID) => hashIDs.decode(userID)[0],
	databaseToUserID: (databaseID) => hashIDs.encode(databaseID)
}
