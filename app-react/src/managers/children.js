import { observable, action } from 'mobx'
import { makeLoader, makeCollectionLoader } from './promises'
import * as itemsAPI from '../api/items'

export const createChildrenObservable = ({ owner, makeNew, displayTextForCount }) => observable({
	owner,

	_itemsLoader: makeCollectionLoader({
		list: () => itemsAPI.listItems({
			owner
		}),
		item: ({ id, type }) => itemsAPI.readItem({
			owner,
			type,
			id
		}),
		// FIXME: requires item to have been loaded in
		finder: ({ id }) => (item) => item.id === id,
		update: ({ id, type }, changes) => itemsAPI.updateItem({
			owner,
			type,
			id,
			...changes
		})
	}),
	get items() {
		return this._itemsLoader.items
	},

	_countLoader: makeLoader(
		itemsAPI.countItems({
			owner
		})
	),
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

	update: action.bound(function(original, changes) {
		return this._itemsLoader.updateItem(original, changes)
	}),

	// -> Promise<{ id }>
	createNewWithType: action.bound(function(type) {
		const baseProperties = !!makeNew ? makeNew(type) : {}

		return itemsAPI.createItem({
			owner: this.owner,
			type,
			...baseProperties
		})
		.then((item) => {
			item = { ...baseProperties, ...item }
			this._itemsLoader.alterItems((items) => {
				items.splice(0, 0, item)
			})
			return item
		})
	}),

	delete: action.bound(function({ id, type }) {
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

	move: action.bound(function({ oldIndex, newIndex }) {
		console.log('MOVE', oldIndex, newIndex)
		return Promise.resolve(true)
		.then(() => {
			this._itemsLoader.alterItems((items) => {
				const movedItem = items[oldIndex]
				items.splice(oldIndex, 1)
				items.splice(newIndex, 0, movedItem)
				// TODO: do network request
			})
		})
	})
})
