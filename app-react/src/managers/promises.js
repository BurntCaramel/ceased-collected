import { observable, action } from 'mobx'

const LOAD_STATUS = {
	NO: 0,
	PENDING: 1,
	COMPLETED: 2
}

export const makeLoader = (promise, defaultValue) => observable({
	_loadedStatus: LOAD_STATUS.NO,
	_result: defaultValue,

	get _promise() {
		return promise
		.then(action(result => {
			console.log('loaded', result)
			this._loadedStatus = LOAD_STATUS.COMPLETED
			this._result = result
		}))
	},

	get result() {
		this._promise
		return this._result

		// const status = this._loadedStatus

		// if (status === LOAD_STATUS.COMPLETED) {
		// 	return this._result
		// }
		// else {
		// 	this._promise
		// 	if (status === LOAD_STATUS.NO) {
		// 	}
		// 	return null
		// }
	},

	alterResult: action.bound(function(alterer) {
		alterer(this._result)
	})
})

export const makeCollectionLoader = (promises) => observable({
	_hasLoaded: false,
	_items: [],

	get _promise() {
		return promises.list({})
		.then(action(items => {
			console.log('loaded items')
			this._hasLoaded = true
			this._items.replace(items)
		}))
	},

	get items() {
		this._promise

		if (this._hasLoaded) {
			return this._items
		}
		else {
			return null
		}
	},

	focusedID: null,
	_focusedItem: null,
	_focusedItemError: null,
	get focusedItem() {
		let item = this._focusedItem
		if (item != null) {
			return item
		}
		
		const idToFind = this.focusedID
		if (idToFind == null) {
			return
		}

		promises.item(idToFind)
		.then(action(item => {
			this._focusedItem = item
			this._focusedItemError = null
		}))
		.catch(action(error => {
			this._focusedItemError = error
		}))

		return null
	},
	get focusedItemError() {
		return this._focusedItemError
	},

	alterItems: action.bound(function(alterer) {
		alterer(this._items)
	}),

	alterItemWithID(id, alterer) {
		this.alterItems(items => {
			const index = items.peek().findIndex(item => item.id === id)
			if (index === -1) {
				return
			}

			alterer(items[index])
		})
	},

	addItem: action.bound(function(itemToAdd) {
		this.alterItems(items => {
			const index = items.peek().findIndex(item => item.id === itemToAdd.id)
			if (index === -1) {
				// Add to end
				items.push(itemToAdd)
			}
			else {
				// Replace at index
				items.splice(index, 1, itemToAdd)
			}
		})
	}),

	removeWithID(id) {
		this.alterItems(items => {
			const index = items.peek().findIndex(item => item.id === id)
			if (index === -1) {
				return
			}

			// Remove at index
			items.splice(index, 1)
		})
	}
})