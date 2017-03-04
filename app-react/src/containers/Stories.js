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

		itemsAPI.updateContentForItem({
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
		const { id } = this.props
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
				saving={ stateManager.saving }
			/>
		)
	}
})

export default class Stories extends React.PureComponent {
	state = {
		stories: null,
		saving: false
	}

	onSaveStory = (contentJSON, id) => {
		this.setState({ saving: true })

		itemsAPI.updateContentForItem({ type: 'story', id, contentJSON })
		.then(() => {
			this.setState({ saving: false })
		})
	}

	onEditTags = (rawTags, id) => {

	}

	componentDidMount() {
		itemsAPI.listWithType({ type: 'story '})
		.then(stories => {
			this.setState({ stories })
			//this.setState({ storyObservables: stories.map(makeStoryState) })
		})
	}

	render() {
		const { stories } = this.state
		return (
			<article>
				<h1>Stories</h1>
				{
					stories ? (
						stories.map((story, index) => (
							<Story key={ index }
								id={ story.id }
								initialJSON={ story.contentJSON }
								initialPreviewDestination={ story.previewDestination }
								name={ story.name }
								onSaveStory={ this.onSaveStory }
								onEditTags={ this.onEditTags }
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
