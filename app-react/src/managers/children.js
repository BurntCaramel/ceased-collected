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

	onUpdate: action.bound(function(changes, { id, type }) {
		this.itemStatus.set(id, true)

		return itemsAPI.updateItem({
			owner: this.owner,
			type,
			id,
			...changes
		})
		.then(action((result) => {
			this.itemStatus.delete(id)
			return result
		}))
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

	deleteWithID: action.bound(function({ id, type }) {
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

	changeNameOf: action.bound(function(name, { id, type }) {
		this._itemsLoader.alterItems((items) => {
			const index = items.peek().findIndex(item => item.id == id)
			if (index === -1) {
				return
			}

			items[index].name = name
		})
	})
})
