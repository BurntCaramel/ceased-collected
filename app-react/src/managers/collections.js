import { extendObservable } from 'mobx'
import * as types from '../constants/itemTypes'
import { createStoriesObservable } from './stories'
import { createRecordsObservable } from './records'
import { createItemsObservable } from './items'
import { createChildrenObservable } from './children'

export const createCollectionsObservable = ({ owner }) => extendObservable(
	createItemsObservable({
		owner,
		type: types.collection,
		makeNew() {
			return {
				contentJSON: { body: '' },
				name: 'Untitled collection'
			}
		},
		displayTextForCount(count) {
			if (count == null) {
				return
			}

			if (count === 1) {
				return '1 collection'
			}
			else {
				return `${count} collections`
			}
		}
	}), {
		get collections() {
			return this.items
		},

		get focusedItemChildrenManager() {
			const owner = this.focusedItemOwner
			if (owner == null) {
				return
			}
			return createChildrenObservable({
				owner,
				makeNew: (type) => ({
					type,
					contentJSON: {
						body: ''
					}
				})
			})
		},

		get focusedItemStoriesManager() {
			const owner = this.focusedItemOwner
			if (owner == null) {
				return
			}
			return createStoriesObservable({ owner })
		},

		get focusedItemRecordsManager() {
			const owner = this.focusedItemOwner
			if (owner == null) {
				return
			}
			return createRecordsObservable({ owner })
		},
	}
)

/*
export const createCollectionsObservable = ({ owner }) => observable({
	owner,

	_collectionsLoader: makeCollectionLoader({
		list: () => itemsAPI.listWithType({
			owner,
			type: types.collection
		}),
		item: (id) => itemsAPI.readItem({
			owner,
			type: types.collection,
			id
		})
	}),

	get collections() {
		return !!this.owner && this._collectionsLoader.items
	},

	get focusedID() {
		return this._collectionsLoader.focusedID
	},
	set focusedID(newID) {
		this._collectionsLoader.focusedID = newID
	},
	get focusedItem() {
		return this._collectionsLoader.focusedItem
	},

	get focusedItemOwner() {
		const id = this.focusedID
		if (id == null) {
			return
		}
		return { type: types.collection, id }
	},

	get focusedItemStoriesManager() {
		const owner = this.focusedItemOwner
		if (owner == null) {
			return
		}
		return createStoriesObservable({ owner })
	},

	get focusedItemRecordsMananger() {
		const owner = this.focusedItemOwner
		if (owner == null) {
			return
		}
		return createItemsObservable({ owner, type: 'record' })
	},

	_collectionStatus: observable.map(),
	isSaving(id) {
		return this._collectionStatus.get(id)
	},

	onSave: action.bound(function({ contentJSON, name }, id) {
		this._collectionStatus.set(id, true)

		itemsAPI.updateItem({
			owner: this.owner,
			type: types.collection,
			id,
			contentJSON,
			name
		})
		.then(action(() => {
			this._collectionStatus.delete(id)
		}))
	}),

	onNew: action.bound(function() {
		const newItem = {
			contentJSON: { body: '' },
			name: 'Untitled'
		}

		itemsAPI.createItem({
			owner: this.owner,
			type: types.collection,
			...newItem
		})
		.then((itemBase) => {
			const item = { ...itemBase, ...newItem }
			this._collectionsLoader.alterItems((items) => {
				items.splice(0, 0, item)
			})
		})
	}),

	onDelete: action.bound(function(id) {
		itemsAPI.deleteItem({
			owner: this.owner,
			type: types.collection,
			id
		})
		.then(() => {
			this._collectionsLoader.removeWithID(id)
		})
	}),

	onChangeName: action.bound(function(name, id) {
		this._collectionsLoader.alterItemWithID(id, item => {
			item.name = name
		})
	})
})
*/