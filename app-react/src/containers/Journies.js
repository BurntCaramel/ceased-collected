import React from 'react'
import { observable, action, reaction } from 'mobx'
import { observer } from 'mobx-react'
import Row from '../components/Row'
import Item from '../components/Item'
import Button from '../components/Button'
import Tabs from '../components/Tabs'
import Field from '../components/Field'
import Label from '../components/Label'
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

		this.disposeBodyReaction = reaction(
			() => ({
				name: this.stateManager.name,
				body: this.stateManager.body
			}),
			({ name, body }) => {
				console.log('Saving')
				this.onSyncChanges()
				/*this.stateManager.sendingSync = true
				this.props.onUpdate({
					name,
					contentJSON: { body }
				}, this.props.item)
				.then(action(result => {
					this.stateManager.sendingSync = false
					this.stateManager.needsSync = false
					// Update with latest from API
					// FIXME: merge
					//this.stateManager.body = result.contentJSON.body
					console.log('Saved', result)
				}))*/
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
				<Row>
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
		<div>
			<Label title='Make new:'>
				<Tabs items={ childTypeTabItems } onSelectID={ childrenManager.createNewWithType } />
			</Label>
			Items: { childrenManager.totalCount }
			{
				!!items ? (
					items.map(item => (
						<Child key={ item.type + ':' + item.id }
							owner={ owner }
							item={ item }
							onUpdate={ childrenManager.onUpdate }
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
	journiesManager
}) {
	return (
		<Item owner={ owner } type={ types.journey } id={ journey.id } name={ journey.name } primary={ primary }>
			{ primary &&
				<JourneyContent
					owner={ journey }
					childrenManager={ journiesManager.focusedItemChildrenManager }
				/>
			}
		</Item>
	)
})

const JourniesList = observer(function JourniesList({
	journies, owner, onNew
}) {
	return (
		<div>
			<section>
				<button onClick={ onNew }>
					New journey
				</button>
			</section>
		{
			journies ? (
				journies.length === 0 ? (
					<p>{ '🐣 Hatch the first journey' }</p>
				) : (
					journies.map((journey, index) => (
						<Journey key={ journey.id }
							journey={ journey }
							owner={ owner }
						/>
					))
				)
			) : (
				'Loading journies…'
			)
		}
		</div>
	)
})

class Journies extends React.Component {
	componentWillMount() {
		const { journiesManager, itemID } = this.props
		if (itemID != null) {
			console.log('journiesManager.focusedID = ', itemID)
			journiesManager.focusedID = itemID
		}
	}

	onNew = (event) => {
		const { journiesManager } = this.props
		journiesManager.createNew()
		.then(item => {
			goTo(pathTo([{ type: types.journey, id: item.id }]))
		})
	}

	render() {
		const { journiesManager, owner } = this.props
		const { focusedID, focusedItem } = journiesManager
		console.log('<Journies> render focusedID', focusedID, this.props.itemID)
		return (
			<article>
				{
					focusedID == null ? (
						<JourniesList
							journies={ journiesManager.journies }
							owner={ owner }
							onNew={ this.onNew }
						/>
					) : (
						!!focusedItem ? (
							<Journey
								journey={ focusedItem }
								owner={ owner }
								primary
								journiesManager={ journiesManager }
							/>
						) : (
							'Loading journey'
						)
					)
				}
			</article>
		)
	}
}

export default observer(Journies)
