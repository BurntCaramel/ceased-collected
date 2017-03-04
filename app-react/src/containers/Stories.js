import React from 'react'
import { extendObservable, observable, action } from 'mobx'
import { observer } from 'mobx-react'
import * as itemsAPI from '../api/items'
import StoryEditor from '../components/StoryEditor'

class Stories extends React.Component {
	state = {
		stories: null
	}

	render() {
		const { owner, storiesManager } = this.props
		const { stories } = storiesManager

		return (
			<article>
				<section>
					<button onClick={ storiesManager.onNew }>
						New story
					</button>
				</section>
				{
					stories ? (
						stories.length === 0 ? (
							<p>{ '🐣 Hatch the first story here' }</p>
						) : (
							stories.map((story, index) => (
								<StoryEditor
									owner={ storiesManager.owner }
									id={ story.id }
									initialJSON={ story.contentJSON }
									initialPreviewDestination={ story.previewDestination }
									name={ story.name }
									onSaveStory={ storiesManager.onSave }
									onEditName={ storiesManager.onChangeName }
									onDelete={ storiesManager.onDelete }
									saving={ storiesManager.isSaving(story.id) }
								/>
							))
						)
					) : (
						'Loading stories…'
					)
				}
			</article>
		)
	}
}

export default observer(Stories)
