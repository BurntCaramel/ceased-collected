import React from 'react'
import { observable, action, reaction } from 'mobx'
import { observer } from 'mobx-react'
import Row from '../components/Row'
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
				performSync({
					name: this.name,
					contentJSON: { body: this.body }
				}, item)
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
					<Field value={ name } grow={ 1 } onChange={ onChangeName } />
					&nbsp;
					<Button title='X' onClick={ this.onDelete } />
					&nbsp;
					<span
						style={{
							opacity: needsSync ? 0.7 : 1.0
						}}
						onClick={ this.onSyncChanges }
					>
						{ '#' + item.type }
					</span>
				</Row>
				<Row>
					<Field value={ body } grow={ 1 } rows={ 5 } onChange={ onChangeBody } />
				</Row>
			</div>
		)
	}
})

const JourneyContent = observer(function JourneyContent({
	owner, childrenManager
}) {
	const { items } = childrenManager
	return (
		<div style={{ marginTop: '1rem' }}>
			<Row marginBottom='1rem'>
				<Label title='Make new:'>
					<Tabs items={ childTypeTabItems } onSelectID={ childrenManager.createNewWithType } />
				</Label>
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
					'Loading items…'
				)
			}
		</div>
	)
})

export const Journey = observer(function Journey({
	journey, owner, primary = false,
	journeysManager
}) {
	return (
		<Item owner={ owner } type={ types.journey } id={ journey.id } name={ journey.name } primary={ primary }>
			{ primary &&
				<JourneyContent
					owner={ journey }
					childrenManager={ journeysManager.focusedItemChildrenManager }
				/>
			}
		</Item>
	)
})

const JourneysList = observer(function JourneysList({
	journeys, owner, onNew
}) {
	return (
		<div>
			<section>
				<button onClick={ onNew }>
					New journey
				</button>
			</section>
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

class Journeys extends React.Component {
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

	render() {
		const { journeysManager, owner } = this.props
		const { focusedID, focusedItem } = journeysManager
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
					<OwnerNav
						owner={{ type: types.journey, id: focusedID }}
						name={ !!focusedItem ? focusedItem.name : 'Loading…' }
					/>
				{
					!!focusedItem ? (
						<JourneyContent
							owner={ focusedItem }
							childrenManager={ journeysManager.focusedItemChildrenManager }
						/>
					) : (
						null
					)
				}
				</div>
			)
		)
	}
}

export default observer(Journeys)
