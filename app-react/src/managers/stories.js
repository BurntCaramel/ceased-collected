import { extendObservable, observable, action } from 'mobx'
import { makeLoader, makeCollectionLoader } from './promises'
import * as itemsAPI from '../api/items'

export const createStoriesObservable = ({ owner }) => observable({
	owner,
	changeCount: 0,

	_storiesLoader: makeCollectionLoader({
		list: () => itemsAPI.listWithType({
			owner,
			type: 'story'
		})
	}),
	get stories() {
		return this._storiesLoader.items
	},

	get _countLoader() {
		return makeLoader(
			itemsAPI.countWithType({
				owner: this.owner,
				type: 'story'
			})
		)
	},
	get totalStoriesCount() {
		return this._countLoader.result
	},
	get totalDisplay() {
		const count = this.totalStoriesCount
		if (count == null) {
			return
		}

		if (count === 0) {
				return 'No stories yet'
			}
		else if (count === 1) {
			return '1 story'
		}
		else {
			return `${count} stories`
		}
	},

	storyStatus: observable.map(),
	isSaving(id) {
		return this.storyStatus.get(id)
	},

	onSave: action.bound(function({ contentJSON, name, previewDestination }, id) {
		this.storyStatus.set(id, true)

		itemsAPI.updateItem({
			owner: this.owner,
			type: 'story',
			id,
			contentJSON,
			name,
			previewDestination
		})
		.then(action(() => {
			this.storyStatus.delete(id)
		}))
	}),

	onNew: action.bound(function() {
		const newStory = {
			contentJSON: { body: '' },
			name: 'Untitled'
		}

		return itemsAPI.createItem({
			owner: this.owner,
			type: 'story',
			...newStory
		})
		.then((story) => {
			story = { ...story, ...newStory }
			this._storiesLoader.alterItems((stories) => {
				stories.splice(0, 0, story)
			})

			return story
		})
	}),

	onDelete: action.bound(function(id) {
		itemsAPI.deleteItem({
			owner: this.owner,
			type: 'story',
			id
		})
		.then(() => {
			this._storiesLoader.alterItems((stories) => {
				const index = stories.peek().findIndex(story => story.id === id)
				if (index == -1) {
					return
				}

				stories.splice(index, 1)
			})
		})
	}),

	onChangeName: action.bound(function(name, id) {
		this._storiesLoader.alterItems((stories) => {
			const index = stories.peek().findIndex(story => story.id == id)
			if (index == -1) {
				return
			}

			stories[index].name = name
		})
	})
})
