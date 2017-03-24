import { extendObservable } from 'mobx'
import * as types from '../constants/itemTypes'
import { createItemsObservable } from './items'
import { createChildrenObservable } from './children'

export const createJourneysObservable = ({ owner }) => extendObservable(
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
				return 'No journeys yet'
			}
			else if (count === 1) {
				return '1 journey'
			}
			else {
				return `${count} journeys`
			}
		}
	}), {
		get journeys() {
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