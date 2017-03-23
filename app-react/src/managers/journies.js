import { extendObservable } from 'mobx'
import * as types from '../constants/itemTypes'
import { createItemsObservable } from './items'
import { createChildrenObservable } from './children'

export const createJourniesObservable = ({ owner }) => extendObservable(
	createItemsObservable({
		owner,
		type: types.journey,
		makeNew() {
			return {
				contentJSON: { description: '' },
				name: 'Untitled journey'
			}
		},
		displayTextForCount(count) {
			if (count == null) {
				return
			}

			if (count === 0) {
				return 'No journies yet'
			}
			else if (count === 1) {
				return '1 journey'
			}
			else {
				return `${count} journies`
			}
		}
	}), {
		get journies() {
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
					contentJSON: {
						body: ''
					}
				})
			})
		}
	}
)