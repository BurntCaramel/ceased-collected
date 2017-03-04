import React from 'react'
import { extendObservable, observable, action } from 'mobx'
import { observer } from 'mobx-react'
import * as itemsAPI from '../api/items'
import StoryEditor from '../components/StoryEditor'

const storyObservableTemplate = {
	saving: false,

	onSaved: action.bound(function() {
		this.saving = false
	}),
	onSaveStory: action.bound(function({ contentJSON, name, previewDestination }, id) {
		this.saving = true

		itemsAPI.updateItem({
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

const Story = observer(class Story extends React.Component {
	constructor(props) {
		super(props)

		this.stateManager = extendObservable({}, storyObservableTemplate, {
			name: props.name,
			rawTags: props.rawTags
		})
	}

	render() {
		const { id, onDelete } = this.props
		const { stateManager } = this
		console.log('render', stateManager.saving)
		return (
			<StoryEditor
				id={ id }
				initialJSON={ this.props.initialJSON }
				initialPreviewDestination={ this.props.initialPreviewDestination }
				name={ stateManager.name }
				onSaveStory={ stateManager.onSaveStory }
				onEditName={ stateManager.onEditName }
				onDelete={ onDelete }
				saving={ stateManager.saving }
			/>
		)
	}
})

export default class Stories extends React.PureComponent {
	state = {
		stories: null
	}
	
	onNewStory = () => {
		const newStory = {
			contentJSON: { body: '' },
			name: 'Untitled'
		}

		itemsAPI.createItem({ type: 'story', ...newStory })
		.then((story) => {
			story = { ...story, ...newStory }
			this.setState(({ stories }) => ({
				stories: [story].concat(stories)
			}))
		})
	}

	onDelete = (id) => {
		itemsAPI.deleteItem({ type: 'story', id })
		.then(() => {
			this.setState(({ stories }) => ({
				stories: stories.filter(story => story.id !== id)
			}))
		})
	}

	componentDidMount() {
		itemsAPI.listWithType({ type: 'story '})
		.then(stories => {
			this.setState({ stories })
		})
	}

	render() {
		const { stories } = this.state
		return (
			<article>
				<h1>Stories</h1>
				<section>
					<button onClick={ this.onNewStory }>
						New story
					</button>
				</section>
				{
					stories ? (
						stories.map((story, index) => (
							<Story key={ index }
								id={ story.id }
								initialJSON={ story.contentJSON }
								initialPreviewDestination={ story.previewDestination }
								name={ story.name }
								onDelete={ this.onDelete }
							/>
						))
					) : (
						'Loading stories…'
					)
				}
			</article>
		)
	}
}
