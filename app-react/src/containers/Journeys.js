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

const childTypeTabItems = [
	{
		title: '+ Screen',
		id: types.screen,
	},
	{
		title: '+ Message',
		id: types.message,
	}
]

const sections = [
	{
		//title: 'Low fidelity',
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
		//title: 'High fidelity',
		title: 'High',
		id: 'hifi'
	}
]

const JourneyReorderableItem = SortableElement(({ item }) =>
  <div>
		{ item.name }
	</div>
)

const JourneyReorderableList = SortableContainer(({ items }) => (
	<div>
	{
		items.map((item, index) => (
			<JourneyReorderableItem key={ item.type + ':' + item.id }
				index={ index }
				item={ item }
			/>
		))
	}
	</div>
))

const EditJourneys = observer(function EditJourneys({
	owner, childrenManager
}) {
	const { items } = childrenManager
	return (
		<section style={{ marginTop: '1rem' }}>
			<Row justifyContent='center'>
				<Tabs items={ childTypeTabItems } onSelectID={ childrenManager.createNewWithType } />
			</Row>
			<Row details marginBottom='1rem' text={{ align: 'center' }}>
				<summary />
				<div>
				{
					!!items ? (
						<JourneyReorderableList
							items={ items }
							onSortEnd={ childrenManager.move }
						/>
					) : (
						'Loading items…'
					)
				}
				</div>
			</Row>
			{
				!!items ? (
					items.map(item => (
						<Child key={ item.type + ':' + item.id }
							owner={ owner }
							item={ item }
							onUpdate={ childrenManager.update }
							onDelete={ childrenManager.delete }
						/>
					))
				) : (
					<Row>Loading items…</Row>
				)
			}
		</section>
	)
})

export const Journey = observer(function Journey({
	journey, owner, primary = false,
	journeysManager
}) {
	return (
		<Row>
			<Item owner={ owner } type={ types.journey } id={ journey.id } name={ journey.name } primary={ primary }>
				{ primary &&
					<EditJourneys
						owner={ journey }
						childrenManager={ journeysManager.focusedItemChildrenManager }
					/>
				}
			</Item>
		</Row>
	)
})

function JourneysActions({
	onNew
}) {
	return (
		<Row>
			<section>
				<button onClick={ onNew }>
					New journey
				</button>
			</section>
		</Row>
	)
}

const JourneysList = observer(function JourneysList({
	journeys, owner, onNew
}) {
	return (
		<div>
			<JourneysActions onNew={ onNew } />
		{
			journeys ? (
				journeys.length === 0 ? (
					<p>{ '🐣 Hatch the first journey' }</p>
				) : (
					journeys.map((journey, index) => (
						<Journey key={ journey.id }
							journey={ journey }
							owner={ owner }
						/>
					))
				)
			) : (
				<Row>Loading journeys…</Row>
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

class Journeys extends React.Component {
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
		const { journeysManager, itemID } = this.props
		journeysManager.focusedID = itemID
	}

	componentWillReceiveProps({ journeysManager, itemID }) {
		if (itemID !== this.props.itemID) {
			journeysManager.focusedID = itemID
		}
	}

	onNew = (event) => {
		const { journeysManager } = this.props
		journeysManager.createNew()
		.then(item => {
			goTo(pathTo([{ type: types.journey, id: item.id }]))
		})
	}

	onRenameFocused = (newName) => {
		const { journeysManager } = this.props
		journeysManager._itemsLoader.updateFocusedItem({ name: newName })
	}

	render() {
		const { journeysManager, owner } = this.props
		const { error, focusedID, focusedItem, focusedItemError } = journeysManager
		const { sectionID } = this.stateManager
		console.log('<Journeys> render focusedID', focusedID, this.props.itemID)
		return (
			error != null ? (
				<APIErrorMessage error={ error } />
			) : focusedID == null ? (
				<div>
					<OwnerNav owner={ owner } sectionTitle='Journeys' />
					<JourneysList
						journeys={ journeysManager.journeys }
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
								owner={{ type: types.journey, id: focusedID }}
								statusMessage={ (focusedItemError.response && focusedItemError.response.status + '!') || focusedItemError.message }
							/>
							<Row marginTop='1rem' marginBottom='1rem'>
								<APIErrorMessage error={ focusedItemError } />
							</Row>
							<Row>
								<JourneysActions onNew={ this.onNew } />
							</Row>
						</div>
					) : (
						<div>
							<OwnerNav
								owner={{ type: types.journey, id: focusedID }}
								statusMessage={ !!focusedItem ? null : 'Loading…' }
								name={ !!focusedItem ? focusedItem.name : null }
								onChangeName={ this.onRenameFocused }
							/>
							<Row justifyContent='center' marginTop='0.5rem'>
								<SectionTabs stateManager={ this.stateManager } />
							</Row>
							{ !!focusedItem && (
								sectionID === 'lofi' ? (
									<EditJourneys
										owner={ focusedItem }
										childrenManager={ journeysManager.focusedItemChildrenManager }
									/>
								) : (
									<ScreensPreview
										owner={ focusedItem }
										stateManager={ this.stateManager }
										childrenManager={ journeysManager.focusedItemChildrenManager }
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

export default observer(Journeys)
