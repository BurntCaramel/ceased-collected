import React from 'react'
import { observable, action, reaction } from 'mobx'
import { observer } from 'mobx-react'
import { parseElement } from 'lofi'
import Screen from 'gateau/lib/screen/Screen'
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc'
import Row from '../components/Row'
import Column from '../components/Column'
import Item from '../components/Item'
import Button from '../components/Button'
import Tabs from '../components/Tabs'
import Field from '../components/Field'
import Label from '../components/Label'
import OwnerNav from '../components/OwnerNav'
import { pathTo } from '../routing/paths'
import goTo from '../routing/goTo'
import * as types from '../constants/itemTypes'

const childTypeTabItems = [
	{
		title: 'Screen',
		id: types.screen,
	},
	{
		title: 'Message',
		id: types.message,
	}
]

const sections = [
	{
		title: 'Edit',
		id: 'edit'
	},
	{
		title: 'Preview',
		id: 'preview'
	}
]

const Child = observer(class Child extends React.Component {
	constructor(props) {
		super(props)

		this.stateManager = observable({
			name: props.item.name,
			body: props.item.contentJSON.body,
			needsSync: false,
			sendingSync: false,

			onChangeName: action.bound(function({ target: { value } }) {
				this.name = value
				this.needsSync = true
			}),

			onChangeBody: action.bound(function({ target: { value } }) {
				this.body = value
				this.needsSync = true
			}),

			syncChanges: action.bound(function(performSync, item) {
				console.log('Saving')
				this.sendingSync = true
				performSync(item, {
					name: this.name,
					contentJSON: { body: this.body }
				})
				.then(action(result => {
					this.sendingSync = false
					this.needsSync = false
					// Update with latest from API
					// FIXME: merge
					//this.body = result.contentJSON.body
					console.log('Saved', result)
				}))
			})
		})

		this.onSyncChanges = () => {
			this.stateManager.syncChanges(
				this.props.onUpdate,
				this.props.item
			)
		}

		this.onDelete = () => {
			this.props.onDelete(this.props.item)
		}

		this.disposeBodyReaction = reaction(
			() => ({
				name: this.stateManager.name,
				body: this.stateManager.body
			}),
			({ name, body }) => {
				this.onSyncChanges()
			}, {
				delay: 2000,
				compareStructural: true,
				name: `Journey Child ${props.type} ${props.id}`
			}
		)
	}

	componentWillUnmount() {
		this.disposeBodyReaction()
		this.disposeBodyReaction = null
	}

	render() {
		const { item, owner } = this.props
		const { name, body, needsSync, sendingSync, onChangeName, onChangeBody } = this.stateManager
		return (
			<div style={{
				marginBottom: '1rem'
			}}>
				<Row wrap justifyContent='flex-end'>
					<Row details>
						<summary>
							<Field value={ name } grow={ 1 } onChange={ onChangeName } />
							&nbsp;
							<span
								style={{
									opacity: needsSync ? 0.7 : 1.0
								}}
								onClick={ this.onSyncChanges }
							>
								{ '#' + item.type }
							</span>
						</summary>
						<Column.Start margin={{ top: '0.5rem', bottom: '0.5rem' }}>
							<Button title='Delete' onClick={ this.onDelete } />
							<div>
								<small><time dateTime={ item.dateUpdated }>
									Updated: { item.dateUpdated }
								</time></small>
							</div>
							<div>
								<small><time dateTime={ item.dateUpdated }>
									Created: { item.dateCreated }
								</time></small>
							</div>
						</Column.Start>
					</Row>
				</Row>
				<Row>
					<Field value={ body } grow={ 1 } rows={ 5 } onChange={ onChangeBody } />
				</Row>
			</div>
		)
	}
})

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
			<Row>
				<Label title='New:'>
					<Tabs items={ childTypeTabItems } onSelectID={ childrenManager.createNewWithType } />
				</Label>
			</Row>
			<Row details marginBottom='1rem'>
				<summary>Reorder</summary>
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

function parseScreenItem(item) {
	return item.contentJSON.body.split('\n\n').map(section => section.split('\n').map(parseElement))
}

const PreviewJourneys = observer(function PreviewJourneys({
	owner, childrenManager
}) {
	const { items } = childrenManager
	return (
		<section style={{ marginTop: '1rem' }}>
			<div>
			{
				!!items ? (
					items.map(item => (
						<div style={{ display: 'inline-block', marginRight: '1rem' }}>
							<Screen key={ item.type + ':' + item.id }
								contentTree={ parseScreenItem(item) }
								ingredients={ [] }
								destinationID='bootstrap'
							/>
						</div>
					))
				) : (
					<Row>Loading items…</Row>
				)
			}
			</div>
		</section>
	)
})

function LoadErrorMessage({ error }) {
	if (error.response) {
		if (error.response.status === 404) {
			return <p>The journey does not exist</p>
		}
		else {
			return <p>{ error.message }</p>
		}
	}
	else {
		return <p>{ error.message }</p>
	}
}

export const Journey = observer(function Journey({
	journey, owner, primary = false,
	journeysManager
}) {
	return (
		<Item owner={ owner } type={ types.journey } id={ journey.id } name={ journey.name } primary={ primary }>
			{ primary &&
				<EditJourneys
					owner={ journey }
					childrenManager={ journeysManager.focusedItemChildrenManager }
				/>
			}
		</Item>
	)
})

function JourneysActions({
	onNew
}) {
	return (
		<section>
			<button onClick={ onNew }>
				New journey
			</button>
		</section>
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
				'Loading journeys…'
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
		sectionID: 'edit',
		onChangeSectionID: action.bound(function(sectionID) {
			this.sectionID = sectionID
		})
	})

	componentWillMount() {
		const { journeysManager, itemID } = this.props
		if (itemID != null) {
			console.log('journeysManager.focusedID = ', itemID)
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
		const { focusedID, focusedItem, focusedItemError } = journeysManager
		const { sectionID } = this.stateManager
		console.log('<Journeys> render focusedID', focusedID, this.props.itemID)
		return (
			focusedID == null ? (
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
								<LoadErrorMessage error={ focusedItemError } />
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
								sectionID === 'edit' ? (
									<EditJourneys
										owner={ focusedItem }
										childrenManager={ journeysManager.focusedItemChildrenManager }
									/>
								) : (
									<PreviewJourneys
										owner={ focusedItem }
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
