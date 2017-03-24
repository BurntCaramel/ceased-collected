import { observable, action } from 'mobx'
import { makeLoader, makeCollectionLoader } from './promises'
import * as itemsAPI from '../api/items'

export const createItemsObservable = ({ owner, type, makeNew, displayTextForCount }) => observable({
	owner,

	_itemsLoader: makeCollectionLoader({
		list: () => itemsAPI.listWithType({
			owner,
			type
		}),
		item: (id) => itemsAPI.readItem({
			owner,
			type,
			id
		})
	}),
	// get _itemsLoader() {
	// 	const { owner } = this
	// 	return makeCollectionLoader({
	// 		list: () => itemsAPI.listWithType({
	// 			owner,
	// 			type
	// 		}),
	// 		item: (id) => itemsAPI.readItem({
	// 			owner,
	// 			type,
	// 			id
	// 		})
	// 	})
	// },
	get items() {
		return !!this.owner && this._itemsLoader.items
	},

	get focusedID() {
		return this._itemsLoader.focusedID
	},
	set focusedID(newID) {
		this._itemsLoader.focusedID = newID
	},
	get focusedItem() {
		return this._itemsLoader.focusedItem
	},
	get focusedItemError() {
		return this._itemsLoader.focusedItemError
	},

	get focusedItemOwner() {
		const id = this.focusedID
		if (id == null) {
			return
		}
		return { type, id }
	},

	get _countLoader() {
		return makeLoader(
			itemsAPI.countWithType({
				owner: this.owner,
				type
			}),
			0
		)
	},
	get totalCount() {
		return this._countLoader.result
	},
	get totalDisplay() {
		return displayTextForCount(this.totalCount)
	},

	itemStatus: observable.map(),
	isSaving(id) {
		return this.itemStatus.get(id)
	},

	onSave: action.bound(function(changes, id) {
		this.itemStatus.set(id, true)

		return itemsAPI.updateItem({
			owner: this.owner,
			type,
			id,
			...changes
		})
		.then(action(() => {
			this.itemStatus.delete(id)
		}))
	}),

	// -> Promise<{ id }>
	createNew: action.bound(function() {
		const newItem = makeNew()

		return itemsAPI.createItem({
			owner: this.owner,
			type,
			...newItem
		})
		.then((item) => {
			item = { ...item, ...newItem }
			this._itemsLoader.alterItems((items) => {
				items.splice(0, 0, item)
			})
			return item
		})
	}),

	deleteWithID: action.bound(function(id) {
		return itemsAPI.deleteItem({
			owner: this.owner,
			type,
			id
		})
		.then(() => {
			this._itemsLoader.alterItems((items) => {
				const index = items.peek().findIndex(item => item.id === id)
				if (index === -1) {
					return
				}

				items.splice(index, 1)
			})
		})
	}),

	changeNameOf: action.bound(function(name, id) {
		this._itemsLoader.alterItems((items) => {
			const index = items.peek().findIndex(item => item.id == id)
			if (index === -1) {
				return
			}

			items[index].name = name
		})
	})
})
