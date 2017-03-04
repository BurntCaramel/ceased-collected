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

const Story = observer(class Story extends React.Component {
	constructor(props) {
		super(props)

		this.stateManager = extendObservable({
			instance: this
		}, storyObservableTemplate, {
			name: props.name,
			rawTags: props.rawTags
		})
	}

	render() {
		const { owner, id, onDelete } = this.props
		const { stateManager } = this
		console.log('render', stateManager.saving)
		return (
			<StoryEditor
				owner={ owner }
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

		itemsAPI.createItem({
			owner: this.props.owner,
			type: 'story',
			...newStory
		})
		.then((story) => {
			story = { ...story, ...newStory }
			this.setState(({ stories }) => ({
				stories: [story].concat(stories)
			}))
		})
	}

	onDelete = (id) => {
		itemsAPI.deleteItem({
			owner: this.props.owner,
			type: 'story',
			id
		})
		.then(() => {
			this.setState(({ stories }) => ({
				stories: stories.filter(story => story.id !== id)
			}))
		})
	}

	componentDidMount() {
		itemsAPI.listWithType({
			owner: this.props.owner,
			type: 'story'
		})
		.then(stories => {
			this.setState({ stories })
		})
	}

	render() {
		const { owner } = this.props
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
								owner={ owner }
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
