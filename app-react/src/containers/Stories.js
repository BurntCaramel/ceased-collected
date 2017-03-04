import React from 'react'
import * as storiesAPI from '../api/stories'
import * as itemsAPI from '../api/items'
import StoryEditor from '../components/StoryEditor'

export default class Stories extends React.PureComponent {
	state = {
		stories: null,
		saving: false
	}

	onSaveStory = (contentJSON, id) => {
		this.setState({ saving: true })

		itemsAPI.updateContentForItem({ id, contentJSON })
		.then(() => {
			this.setState({ saving: false })
		})
	}

	componentDidMount() {
		storiesAPI.list()
		.then(stories => {
			this.setState({ stories })
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
							<StoryEditor key={ index }
								id={ story.id }
								initialJSON={ story.contentJSON }
								onSaveStory={ this.onSaveStory }
								saving={ this.state.saving }
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
