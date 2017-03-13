import { extendObservable } from 'mobx'
import * as types from './types'
import * as itemsAPI from '../api/items'
import { createItemsObservable } from './items'

export const createRecordsObservable = ({ owner }) => extendObservable(
	createItemsObservable({
		owner,
		type: types.record,
		makeNew() {
			return {
				contentJSON: { body: '' },
				name: 'Untitled record'
			}
		},
		displayTextForCount(count) {
			if (count == null) {
				return
			}

			if (count === 0) {
				return 'No records yet'
			}
			else if (count === 1) {
				return '1 record'
			}
			else {
				return `${count} records`
			}
		}
	}), {

	}
)