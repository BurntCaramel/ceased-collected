import { extendObservable, observable, action } from 'mobx'
import { makeCollectionLoader } from './promises'
import * as itemsAPI from '../api/items'

export const createStoriesObservable = ({ owner }) => observable({
	owner,

	get _storiesLoader() {
		return makeCollectionLoader(
			itemsAPI.listWithType({
				owner: this.owner,
				type: 'story'
			})
		)
	},
	get stories() {
		return this._storiesLoader.items
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

		itemsAPI.createItem({
			owner: this.owner,
			type: 'story',
			...newStory
		})
		.then((story) => {
			story = { ...story, ...newStory }
			this.stories.splice(0, 0, story)
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

const storyObservableTemplate = {
	saving: false,

	onSaved: action.bound(function() {
		this.saving = false
	}),
	onSaveStory: action.bound(function({ contentJSON, name, previewDestination }, id) {
		this.saving = true

		const { props } = this.instance

		itemsAPI.updateItem({
			owner: props.owner,
			type: 'story',
			id,
			contentJSON,
			name,
			previewDestination
		})
		.then(this.onSaved)
	}),

	onEditName: action.bound(function(name) {
		this.name = name
	})
}