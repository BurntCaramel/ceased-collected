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

export const makeCollectionLoader = (options) => observable({
	_hasLoaded: false,
	_items: [],
	_itemStatus: observable.map(),
	_error: observable.box(null),

	get _promise() {
		return options.list({})
		.then(action(items => {
			console.log('loaded items')
			this._hasLoaded = true
			this._items.replace(items)
			this._error.set(null)
		}))
		.catch(action(error => {
			this._error.set(error)
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

	get error() {
		return this._error.get()
	},

	focusedID: null,
	_focusedItem: null,
	_focusedItemError: null,
	get focusedItem() {
		let item = this._focusedItem
		if (item != null) {
			return item
		}
		
		const id = this.focusedID
		if (id == null) {
			return
		}

		options.item(id)
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
		const findIndex = (original) => this._items.peek().findIndex(options.finder(original))
		alterer(this._items, { findIndex })
	}),

	alterItem: action.bound(function(original, alterer) {
		this.alterItems((items, { findIndex }) => {
			const index = findIndex(original)
			if (index === -1) {
				return
			}

			alterer(items[index], index)
		})
	}),

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

	updateItem: action.bound(function(original, changes) {
		this._itemStatus.set(original.id, true)

		this.alterItem(original, (item, index) => {
			Object.assign(item, changes)
		})

		return options.update(original, changes)
		.then(action(result => {
			this._itemStatus.delete(original.id)

			this.alterItem(original, (item, index) => {
				Object.assign(item, result)
			})

			return result
		}))
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
	},

	updateFocusedItem: action.bound(function(changes) {
		const item = this.focusedItem
		if (item == null) {
			return
		}

		Object.assign(item, changes)
		return this.updateItem(item, changes)
	})
})