import React from 'react'
import { observer } from 'mobx-react'
import Link from '../components/Link'
import Item from '../components/Item'
import StoryEditor from '../components/StoryEditor'
import { pathTo } from '../routing/paths'
import goTo from '../routing/goTo'
import * as types from '../managers/types'

const StorySummary = observer(function StorySummary({
	owner,
	story,
	primary = false,
	storiesManager
}) {
	if (primary) {
		return (
			<StoryEditor
				owner={ owner }
				id={ story.id }
				initialJSON={ story.contentJSON }
				initialPreviewDestination={ story.previewDestination }
				name={ story.name }
				onSaveStory={ storiesManager.onSave }
				onEditName={ storiesManager.onChangeName }
				onDelete={ storiesManager.onDelete }
				saving={ storiesManager.isSaving(story.id) }
			/>
		)
	}
	else {
		return (
			<Item
				owner={ owner }
				type={ types.story }
				id={ story.id }
				name={ story.name }
				primary={ primary }
			>
				<pre>{ story.contentJSON.body }</pre>
				{ false && <p><small>{ story.previewDestination.framework }</small></p> }
			</Item>
		)
	}
})

class Stories extends React.Component {
	onNew = (event) => {
		const { storiesManager, owner } = this.props
		storiesManager.onNew()
		.then(item => {
			goTo(pathTo([owner, { type: types.story, id: item.id }]))
		})
	}

	render() {
		const { owner, storiesManager } = this.props
		const { stories } = storiesManager

		return (
			<article>
				<section>
					<button onClick={ this.onNew }>
						New story
					</button>
					<span>{ storiesManager.totalStoriesDisplay }</span>
				</section>
				{
					stories ? (
						stories.length === 0 ? (
							<p>{ '🐣 Hatch the first story here' }</p>
						) : (
							stories.map((story, index) => (
								<StorySummary key={ story.id }
									owner={ storiesManager.owner }
									story={ story }
									storiesManager={ storiesManager }
								/>
								/*<StoryEditor key={ story.id }
									owner={ storiesManager.owner }
									id={ story.id }
									initialJSON={ story.contentJSON }
									initialPreviewDestination={ story.previewDestination }
									name={ story.name }
									onSaveStory={ storiesManager.onSave }
									onEditName={ storiesManager.onChangeName }
									onDelete={ storiesManager.onDelete }
									saving={ storiesManager.isSaving(story.id) }
								/>*/
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
