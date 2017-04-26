import React from 'react'
import { observer } from 'mobx-react'
import Link from '../components/Link'
import Item from '../components/Item'
import { pathTo } from '../routing/paths'
import goTo from '../routing/goTo'
import * as types from '../constants/itemTypes'

const Collection = observer(function Collection({
	id, owner, name, primary = false, storiesManager, recordsManager
}) {
	return (
		<Item owner={ owner } type={ types.collection } id={ id } name={ name } primary={ primary }>
			<Link to={[{ type: types.collection, id }, { type: types.story }]}>
				{ (primary && storiesManager.totalDisplay) || 'Stories' }
			</Link>
			<br />
			<Link to={[{ type: types.collection, id }, { type: types.record }]}>
				{ (primary && recordsManager.totalDisplay) || 'Records' }
			</Link>
		</Item>
	)
})

const CollectionsList = observer(function CollectionsList({
	collections, owner, onNew
}) {
	return (
		<div>
			<section>
				<button onClick={ onNew }>
					New collection
				</button>
			</section>
		{
			collections ? (
				collections.length === 0 ? (
					<p>{ '🐣 Hatch the first collection here' }</p>
				) : (
					collections.map((collection, index) => (
						<Collection key={ collection.id }
							name={ collection.name }
							id={ collection.id }
							owner={ owner }
						/>
					))
				)
			) : (
				'Loading collections…'
			)
		}
		</div>
	)
})

class Collections extends React.Component {
	componentWillMount() {
		const { collectionsManager, itemID } = this.props
		if (itemID != null) {
			console.log('collectionsManager.focusedID = ', itemID)
			collectionsManager.focusedID = itemID
		}
	}

	onNew = (event) => {
		const { collectionsManager } = this.props
		collectionsManager.onNew()
		.then(item => {
			goTo(pathTo([{ type: types.collection, id: item.id }]))
		})
	}

	render() {
		const { collectionsManager, owner } = this.props
		const { focusedID, focusedItem } = collectionsManager
		console.log('render focusedID', focusedID, this.props.itemID)
		return (
			<article>
				{
					focusedID == null ? (
						<CollectionsList
							collections={ collectionsManager.collections }
							owner={ owner }
							onNew={ this.onNew }
						/>
					) : (
						<header>
						{
							!!focusedItem ? (
								<Collection
									{ ...focusedItem }
									owner={ owner }
									primary
									storiesManager={ collectionsManager.focusedItemStoriesManager }
									recordsManager={ collectionsManager.focusedItemRecordsManager }
								/>
							) : (
								'Loading collection…'
							)
						}
						</header>
					)
				}
			</article>
		)
	}
}

export default observer(Collections)
