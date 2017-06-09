import React from 'react'
import { observable, action, reaction } from 'mobx'
import { observer } from 'mobx-react'
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc'
import Row from '../components/Row'
import Column from '../components/Column'
import Item from '../components/Item'
import Button from '../components/Button'
import Tabs from '../components/Tabs'
import Field from '../components/Field'
import Label from '../components/Label'
import OwnerNav from '../components/OwnerNav'
import APIErrorMessage from '../components/APIErrorMessage'
import Child from './ItemEditor'
import { pathTo } from '../routing/paths'
import goTo from '../routing/goTo'
import * as types from '../constants/itemTypes'
import * as PreviewTypes from './PreviewTypes'
import ScreensPreview from './ScreensPreview'

const childTypeItemsA = [
	{
		title: '+ Microcopy',
		//id: types.copy,
		id: 'copy'
	},
	{
		title: '+ Record',
		//id: types.record,
		id: 'record',
	},
	{
		title: '+ Model',
		//id: types.component,
		id: 'model',
	}
]

const childTypeItemsB = [
	{
		title: '+ Component',
		//id: types.component,
		id: 'component',
	},
	// {
	// 	title: '+ Icon',
	// 	id: 'icon',
	// },
	{
		title: '+ Picture',
		//id: types.component,
		id: 'picture',
	}
]

const sections = [
	{
		title: 'Low',
		id: 'lofi'
	},
	// {
	// 	title: 'Content',
	// 	id: 'content'
	// },
	{
		title: 'Interactive',
		id: 'interact'
	},
	{
		title: 'High',
		id: 'hifi'
	}
]

const ReorderableItem = SortableElement(({ item }) =>
  <div>
		{ item.name }
	</div>
)

const ReorderableList = SortableContainer(({ items }) => (
	<div>
	{
		items.map((item, index) => (
			<ReorderableItem key={ item.type + ':' + item.id }
				index={ index }
				item={ item }
			/>
		))
	}
	</div>
))

const EditCollections = observer(function EditCollections({
	owner, childrenManager
}) {
	const { items } = childrenManager
	return (
		<section style={{ marginTop: '1rem' }}>
			<Row wrap justifyContent='center'>
				<Tabs items={ childTypeItemsA } onSelectID={ childrenManager.createNewWithType } />
				<Tabs items={ childTypeItemsB } onSelectID={ childrenManager.createNewWithType } />
			</Row>
			{
				(!!items && items.length > 0) && (
						<Row details marginBottom='1rem' justifyContent='center' text={{ align: 'center' }}>
							<summary />
							<div>
								<ReorderableList
									items={ items }
									onSortEnd={ childrenManager.move }
								/>
							</div>
					</Row>
				)
			}
			{
				!!items ? (
					items.length > 0 ? (
						items.map(item => (
							<Child key={ item.type + ':' + item.id }
								owner={ owner }
								item={ item }
								onUpdate={ childrenManager.update }
								onDelete={ childrenManager.delete }
							/>
						))
					) : (
						<Row
							marginTop='0.5rem'
							justifyContent='center'
							children='Create the first item!'
						/>
					)
				) : (
					<Row
						marginTop='0.5rem'
						justifyContent='center'
						children='Loading items…'
					/>
				)
			}
		</section>
	)
})

export const Collection = observer(function Journey({
	collection, owner, primary = false,
	collectionsManager
}) {
	return (
		<Row>
			<Item owner={ owner } type={ types.collection } id={ collection.id } name={ collection.name } primary={ primary }>
				{ primary &&
					<EditCollections
						owner={ collection }
						childrenManager={ collectionsManager.focusedItemChildrenManager }
					/>
				}
			</Item>
		</Row>
	)
})

function CollectionsActions({
	onNew
}) {
	return (
		<Row>
			<section>
				<button onClick={ onNew }>
					New collection
				</button>
			</section>
		</Row>
	)
}

const CollectionsList = observer(function CollectionsList({
	collections, owner, onNew
}) {
	return (
		<div>
			<CollectionsActions onNew={ onNew } />
		{
			collections ? (
				collections.length === 0 ? (
					<p>{ '🐣 Hatch the first collection' }</p>
				) : (
					collections.map((collection, index) => (
						<Collection key={ collection.id }
							collection={ collection }
							owner={ owner }
						/>
					))
				)
			) : (
				<Row>Loading collections…</Row>
			)
		}
		</div>
	)
})

const SectionTabs = observer(function SectionTabs({
	stateManager: {
		sectionID,
		onChangeSectionID
	}
}) {
	return (
		<Tabs
			items={ sections }
			selectedID={ sectionID }
			fullWidth
			onSelectID={ onChangeSectionID }
		/>
	)
})

class Collections extends React.Component {
	stateManager = observable({
		sectionID: 'lofi',
		onChangeSectionID: action.bound(function(sectionID) {
			this.sectionID = sectionID
		}),

		previewType: PreviewTypes.initial,
		onChangePreviewType: action.bound(function(previewType) {
			this.previewType = previewType
		})
	})

	componentWillMount() {
		const { collectionsManager, itemID } = this.props
		collectionsManager.focusedID = itemID
	}

	componentWillReceiveProps({ collectionsManager, itemID }) {
		if (itemID !== this.props.itemID) {
			collectionsManager.focusedID = itemID
		}
	}

	onNew = (event) => {
		const { collectionsManager } = this.props
		collectionsManager.createNew()
		.then(item => {
			goTo(pathTo([{ type: types.collection, id: item.id }]))
		})
	}

	onRenameFocused = (newName) => {
		const { collectionsManager } = this.props
		collectionsManager._itemsLoader.updateFocusedItem({ name: newName })
	}

	render() {
		const { collectionsManager, owner } = this.props
		const { error, focusedID, focusedItem, focusedItemError } = collectionsManager
		const { sectionID } = this.stateManager
		console.log('<Collections> render focusedID', focusedID, this.props.itemID)
		return (
			error != null ? (
				<APIErrorMessage error={ error } />
			) : focusedID == null ? (
				<div>
					<OwnerNav owner={ owner } sectionTitle='Collections' />
					<CollectionsList
						collections={ collectionsManager.collections }
						owner={ owner }
						onNew={ this.onNew }
					/>
				</div>
			) : (
				<div>
				{
					!!focusedItemError ? (
						<div>
							<OwnerNav
								owner={{ type: types.collection, id: focusedID }}
								statusMessage={ (focusedItemError.response && focusedItemError.response.status + '!') || focusedItemError.message }
							/>
							<Row marginTop='1rem' marginBottom='1rem'>
								<APIErrorMessage error={ focusedItemError } />
							</Row>
							<Row>
								<CollectionsActions onNew={ this.onNew } />
							</Row>
						</div>
					) : (
						<div>
							<OwnerNav
								owner={{ type: types.collection, id: focusedID }}
								statusMessage={ !!focusedItem ? null : 'Loading…' }
								name={ !!focusedItem ? focusedItem.name : null }
								onChangeName={ this.onRenameFocused }
							/>
							<Row justifyContent='center' marginTop='0.5rem'>
								<SectionTabs stateManager={ this.stateManager } />
							</Row>
							{ !!focusedItem && (
								sectionID === 'lofi' ? (
									<EditCollections
										owner={ focusedItem }
										childrenManager={ collectionsManager.focusedItemChildrenManager }
									/>
								) : (
									<ScreensPreview
										owner={ focusedItem }
										shrinkHeight
										stateManager={ this.stateManager }
										childrenManager={ collectionsManager.focusedItemChildrenManager }
									/>
								)
							) }
						</div>
					)
				}
				</div>
			)
		)
	}
}

export default observer(Collections)
