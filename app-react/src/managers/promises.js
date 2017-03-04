import { observable, action } from 'mobx'

export const makeCollectionLoader = (promise) => observable({
	_hasLoaded: false,
	_items: [],

	get _promise() {
		return promise
		.then(action(items => {
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

	alterItems: action.bound(function(alterer) {
		alterer(this._items)
	})
})